import { Injectable, ShutdownSignal } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ = require('lodash');
import moment = require('moment');
import { Model, Types } from 'mongoose';
import { AppService, Record } from 'src/app/app.service';
import { LoggerService } from 'src/app/logger/logger.service';
import { ContractService } from 'src/finance/contract/contract.service';
import { User } from 'src/users/users.service';
import { convert } from 'src/utils/pinyin';

@Injectable()
export class RecordService {
  constructor(
    @InjectModel('Record') private recordModel: Model<Record>,
    private loggerService: LoggerService,
    private appService: AppService,
    private contractService: ContractService,
  ) { }

  async delete(recordId: string) {
    const res = await this.recordModel.updateOne({ _id: new Types.ObjectId(recordId) }, { valid: false })
    return res.modifiedCount
  }
  async recover(recordId: string) {
    const res = await this.recordModel.updateOne({ _id: new Types.ObjectId(recordId) }, { valid: true })
    return res.modifiedCount
  }

  async create(body: Record, user: User) {
    let record = new this.recordModel(body)
    // TODO 1) 根据订单类型初始化
    // 2) 订单号计算逻辑
    record.number = await this.appService.genNextNumber('record')
    // 3) 制单人
    record.username = user.username
    // 4) 保存历史订单
    const savedRecord = await record.save()
    // 5) 异步落下日志
    this.loggerService.logNewRecord(savedRecord, user)
    // 6) 异步更新合同
    this.contractService.updateCalcStatus(savedRecord)
    return savedRecord
  }

  inRange(ruleStart: string, ruleEnd: string, date: string) {
    const l = moment(ruleStart).startOf('day')
    const r = moment(ruleEnd).add(1, 'day').startOf('day')
    const cur = moment(date)
    return l <= cur && cur < r
  }

  async findById(recordId: string | number) {
    // 在当前的机制下，单据出入库可能关联多个合同，实际情况应该只有一个合同
    let record = null
    if (_.toNumber(recordId)) {
      record = await this.recordModel.findOne({ number: recordId })
    } else {
      record = await this.recordModel.findOne({ _id: recordId })
    }
    if (record === null) {
      throw new Error('找不到单据：' + recordId)
    }

    const contract = await this.contractService.findProbablyContract(record)
    const categories = ['租金', '非租', '装卸运费']
    const rules = {}
    categories.forEach(category => {
      const rule = _.find(_.reverse([..._.get(contract, 'items')]),
        item => item.category === category && this.inRange(item.start, item.end, record.outDate))
      rules[category] = {
        fee: _.get(rule, 'plan'),
        weight: _.get(rule, 'weight'),
      }
    })
    const header = await this.recordModel.aggregate([
      {
        $match: {
          _id: record._id,
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'inStock',
          foreignField: '_id',
          as: 'inStock'
        }
      },
      {
        $unwind: {
          path: '$inStock',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'outStock',
          foreignField: '_id',
          as: 'outStock'
        }
      },
      {
        $unwind: {
          path: '$outStock',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $set: {
          complements: null,
          entries: null,
        }
      }
    ])

    const entries = await this.recordModel.aggregate([
      // 1)展开
      {
        $match: {
          _id: record._id,
        },
      },
      {
        $unwind: {
          path: '$entries',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $project: {
          id: '$entries._id',
          type: '$entries.type',
          name: '$entries.name',
          size: '$entries.size',
          count: '$entries.count',
          comments: '$entries.comments',
          price: '$entries.price',
        }
      },
      // 2) 关联产品表
      {
        $lookup: {
          from: 'products',
          let: { productType: '$type', productName: '$name', productSize: '$size' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$type', '$$productType'] },
                    { $eq: ['$name', '$$productName'] },
                    { $eq: ['$size', '$$productSize'] },
                  ]
                }
              }
            }
          ],
          as: 'product',
        }
      },
      {
        $unwind: {
          path: '$product',
          preserveNullAndEmptyArrays: true,
        }
      },
      // 3) 关联租金表
      {
        $lookup: {
          from: 'rules',
          let: { productType: '$type', productName: '$name', productSize: '$size' },
          pipeline: [
            {
              $match: { _id: rules['租金'].fee }
            },
            {
              $unwind: '$items'
            },
            {
              $match: {
                $expr: {
                  $cond: {
                    if: {
                      $eq: ['$items.level', '产品']
                    },
                    then: {
                      $and: [
                        { $eq: ['$items.product.type', '$$productType'] },
                        { $eq: ['$items.product.name', '$$productName'] },
                      ]
                    },
                    else: {
                      $and: [
                        { $eq: ['$items.product.type', '$$productType'] },
                        { $eq: ['$items.product.name', '$$productName'] },
                        { $eq: ['$items.product.size', '$$productSize'] },
                      ]
                    }
                  },
                }
              }
            }
          ],
          as: 'rentRule'
        }
      },
      {
        $unwind: {
          path: '$rentRule',
          preserveNullAndEmptyArrays: true,
        }
      },
      // 4) 关联重量表
      {
        $lookup: {
          from: 'rules',
          let: { productType: '$type', productName: '$name', productSize: '$size' },
          pipeline: [
            {
              $match: { _id: rules['租金'].weight },
            },
            {
              $unwind: '$items',
            },
            {
              $match: {
                $expr: {
                  $cond: {
                    if: {
                      $eq: ['$items.level', '产品']
                    },
                    then: {
                      $and: [
                        { $eq: ['$items.product.type', '$$productType'] },
                        { $eq: ['$items.product.name', '$$productName'] },
                      ]
                    },
                    else: {
                      $and: [
                        { $eq: ['$items.product.type', '$$productType'] },
                        { $eq: ['$items.product.name', '$$productName'] },
                        { $eq: ['$items.product.size', '$$productSize'] },
                      ]
                    }
                  },
                }
              }
            }
          ],
          as: 'weightRule',
        }
      },
      {
        $unwind: {
          path: '$weightRule',
          preserveNullAndEmptyArrays: true,
        }
      },
      // 5) 组装结果
      {
        $project: {
          _id: '$id',
          price: '$price',
          subtotal: {
            $switch: {
              branches: [
                { case: { $eq: ['$rentRule.items.countType', '重量'] }, then: 'weight' },
                { case: { $eq: ['$rentRule.items.countType', '数量'] }, then: 'count' },
                { case: { $eq: ['$rentRule.items.countType', '换算数量'] }, then: 'scale' },
                { case: '$product.isScaled', then: 'scale' },
              ],
              default: 'count'
            }
          },
          type: '$type',
          name: '$name',
          size: '$size',
          scale: '$product.scale',
          count: '$count',
          countUnit: '$product.countUnit',
          comments: '$comments',
          weight: {
            $multiply: [
              '$count',
              0.001,
              { $ifNull: ['$weightRule.items.weight', '$product.weight'] },
              {
                $cond: {
                  if: {
                    $eq: ['$weightRule.items.countType', '换算数量'],
                  },
                  then: '$product.scale',
                  else: 1,
                }
              }
            ]
          },
          unit: {
            $switch: {
              branches: [
                { case: { $eq: ['$rentRule.items.countType', '重量'] }, then: '吨' },
                { case: { $eq: ['$rentRule.items.countType', '数量'] }, then: '$product.countUnit' },
                { case: { $eq: ['$rentRule.items.countType', '换算数量'] }, then: '$product.unit' },
                { case: '$product.isScaled', then: '$product.unit' },
              ],
              default: '$product.countUnit'
            }
          }
        }
      },
      {
        $set: {
          subtotal: {
            $switch: {
              branches: [
                { case: { $eq: ['$subtotal', 'weight'] }, then: '$weight' },
                { case: { $eq: ['$subtotal', 'count'] }, then: '$count' },
                { case: { $eq: ['$subtotal', 'scale'] }, then: { $multiply: ['$count', '$scale'] } },
              ],
              default: 0
            }
          },
        }
      },
    ])

    const result = _.assign({}, record.toObject(), header[0], { entries }, { complements: record.complements })
    return result
  }

  async update(body: Record, recordId: string, user: User) {
    const record = await this.recordModel.findById(recordId)
    const lhs = record.toObject()
    Object.assign(record, body)
    // TODO 记录修改人
    // record.username = user.username
    const updatedRecord = await record.save()
    const rhs = updatedRecord.toObject()
    // 异步落下日志
    this.loggerService.logRecordDiff(lhs, rhs, user)
    // 异步更新合同
    this.contractService.updateCalcStatus(updatedRecord)
    return updatedRecord
  }

  async updateTransport(body: any, recordId: string, user: User) {
    const record = await this.recordModel.findById(recordId)
    Object.assign(record.transport, body)
    // 标记存在运输单
    record.hasTransport = true
    const updatedRecord = await record.save()
    return updatedRecord
  }

  async findPayer() {
    const result = await this.recordModel.distinct('transport.payer', { 'transport.payer': { $ne: '' } })
    const payers = result.map((payer) => ({
      name: payer,
      pinyin: convert(payer),
    }))
    return payers
  }

  async updateTransportPaidStatus(paid: boolean, recordId: string) {
    await this.recordModel.findOneAndUpdate({ _id: recordId }, { $set: { transportPaid: paid } })
    // TODO 落下日志
    return paid
  }

  async updateTransportCheckedStatus(checked: boolean, recordId: string) {
     await this.recordModel.findOneAndUpdate({ _id: recordId}, { $set: { transportChecked: checked } })
    // TODO 落下日志
     return checked
  }
}
