import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Model, Types } from 'mongoose';
import { Price, Record } from 'src/app/app.service';
import { LoggerService } from 'src/app/logger/logger.service';
import { User } from 'src/users/users.service';

@Injectable()
export class StoreService {
  constructor(
    private loggerService: LoggerService,
    @InjectModel('Price') private priceModel: Model<Price>,
    @InjectModel('Record') private recordModel: Model<Record>,
  ) { }

  /**
   * 查询库存信息
   * @param projectId 库存ID
   * @param params 条件
   * @param user 用户
   */
  async summary(projectId: string, params: any, user: User) {
    this.loggerService.logInfo(user, '查询', { message: '查询库存信息' })
    const aggregateExpr: any = [
      {
        $match: {
          valid: true,
          flowStatus: 'finished',
        }
      },
      {
        $facet: {
          outRecords: [
            {
              $match: {
                outStock: Types.ObjectId(projectId),
                outDate: {
                  $gte: new Date(params.startDate),
                  $lt: new Date(params.endDate)
                }
              },
            },
            {
              $unwind: '$entries'
            },
            {
              $match: {
                'entries.mode': {
                  $ne: 'R'
                }
              }
            },
            {
              $group: {
                _id: {
                  name: '$entries.name',
                  size: '$entries.size'
                },
                sum: {
                  $sum: '$entries.count'
                }
              }
            }
          ],
          inRecords: [
            {
              $match: {
                inStock: Types.ObjectId(projectId),
                outDate: {
                  $gte: new Date(params.startDate),
                  $lt: new Date(params.endDate)
                }
              },
            },
            {
              $unwind: '$entries'
            },
            {
              $match: {
                'entries.mode': {
                  $ne: 'R'
                }
              }
            },
            {
              $group: {
                _id: {
                  name: '$entries.name',
                  size: '$entries.size'
                },
                sum: {
                  $sum: '$entries.count'
                }
              }
            }
          ]
        }
      }
    ]
    if (params.type) {
      aggregateExpr[0] = {
        $match: {
          valid: true,
          flowStatus: 'finished',
          type: params.type,
        }
      }
    }
    const [{ inRecords, outRecords }] = await this.recordModel.aggregate(aggregateExpr)
    return { inRecords, outRecords }
  }

  /**
   * 出入库查询
   * @param condition 搜索条件
   * @param user 搜索用户
   */
  async search(condition: any, user: User) {
    this.loggerService.logInfo(user, '查询', { message: '查询出入库信息' })
    let match: any = {
      outDate: {
        $gte: new Date(condition.startDate),
        $lt: new Date(condition.endDate)
      },
      valid: true,
      flowStatus: 'finished',
    }
    // 是否查询无效单
    if (_.isBoolean(condition.valid)) {
      match['valid'] = condition.valid
    }
    // 记录类型
    if (condition.type) {
      match['type'] = condition.type
    }
    // 查询运输单
    if (condition.hasTransport) {
      match['hasTransport'] = true
    }
    // 查询车号
    if (condition.carNumber) {
      match['carNumber'] = condition.carNumber
    }
    // 查询收款人
    if (condition.payee) {
      match['transport.payee'] = condition.payee
    }
    // 查询付款方
    if (condition.payer) {
      match['transport.payer'] = condition.payer
    }
    // 查询原始单号
    if (condition.originalOrder) {
      match['originalOrder'] = condition.originalOrder
    }
    // 需要查询对方仓库 调拨单
    if (condition.other) {
      const id = Types.ObjectId(condition.other)
      if (condition.company) {
        if (condition.inOut == '出库') {
          match['$or'] = [
            { outStock: id },
          ]
        } else if (condition.inOut == '入库') {
          match['$or'] = [
            { inStock: id },
          ]
        } else {
          match['$or'] = [
            { outStock: id },
            { inStock: id },
          ]
        }
      } else {
        // 处理出入库
        if (condition.inOut == '出库') {
          match['$or'] = [
            { inStock: id, outStock: Types.ObjectId(condition.self) },
          ]
        } else if (condition.inOut == '入库') {
          match['$or'] = [
            { outStock: id, inStock: Types.ObjectId(condition.self) },
          ]
        } else {
          match['$or'] = [
            { outStock: id, inStock: Types.ObjectId(condition.self) },
            { inStock: id, outStock: Types.ObjectId(condition.self) },
          ]
        }
      }
    } else {
      // 如果不是公司角度搜索，加限制条件
      if (!condition.company) {
        // 处理出入库
        if (condition.inOut == '出库') {
          match['$or'] = [
            { outStock: Types.ObjectId(condition.self) },
          ]
        } else if (condition.inOut == '入库') {
          match['$or'] = [
            { inStock: Types.ObjectId(condition.self) },
          ]
        } else {
          match['$or'] = [
            { inStock: Types.ObjectId(condition.self) },
            { outStock: Types.ObjectId(condition.self) },
          ]
        }
      }
    }
    // 查询单号 当按单号查询的时候，忽略其他条件
    if (condition.number) {
      match = {
        number: Number(condition.number)
      }
    }
    const search = await this.recordModel.aggregate([
      {
        $match: match
      }
    ])
    return search;
  }
  /**
   * 计算租金信息
   * @param param0 
   */
  async calculate({startDate, endDate, project, pricePlanId, user, weightPlanId=null})  {
    this.loggerService.logInfo(user, '查询', { message: '计算租金信息' })
    const pricePlan = await this.priceModel.findOne({ _id: pricePlanId })
    // 兼容旧方案
    let weightPlanIdSelected = pricePlan.weightPlan
    if (weightPlanId) {
      weightPlanIdSelected =  Types.ObjectId(weightPlanId)
    }
    const repairPlanId = pricePlan.repairPlan
    const compensationPlanId = pricePlan.compensationPlan
    const result = await this.recordModel.aggregate([
      {
        // 关联调拨单
        $match: {
          $or: [
            {
              inStock: project
            },
            {
              outStock: project
            }
          ],
          type: '调拨',
          outDate: {
            $lt: endDate,
          }
        }
      },
      // 添加历史
      {
        $addFields: {
          history: {
            $lt: ['$outDate', startDate]
          },
        }
      },
      // 和上面不能合并，我们需要先计算是否是历史再进行日期设置
      {
        $addFields: {
          outDate: {
            $cond: {
              if: '$history',
              then: startDate,
              else: '$outDate',
            },
          },
          inOut: {
            $cond: {
              if: {
                $eq: ['$inStock', project]
              },
              then: 1,
              else: -1
            }
          }
        }
      },
      // 展开明细
      {
        $unwind: '$entries'
      },
      // 只保留租赁
      {
        $match: {
          $or: [
            { 'entries.mode': 'L' },
            { 'entries.mode': { $exists: false } }
          ]
        }
      },
      // 关联单位数量
      {
        $lookup: {
          from: 'products',
          localField: 'entries.number',
          foreignField: 'number',
          as: 'products',
        }
      },
      {
        $unwind: '$products'
      },
      // 关联重量
      {
        $lookup: {
          from: 'plans',
          let: { productType: '$entries.type', productName: '$entries.name', productSize: '$entries.size' },
          pipeline: [
            {
              $match: { _id: weightPlanIdSelected },
            },
            {
              $unwind: '$entries',
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [ '$entries.type', '$$productType' ] },
                    { $eq: [ '$entries.name', '$$productName' ] },
                    { $eq: [ '$entries.size', '$$productSize' ] },
                  ]
                }
              }
            }
          ],
          as: 'weightPlan',
        }
      },
      {
        $unwind: {
          path: '$weightPlan',
          preserveNullAndEmptyArrays: true,
        }
      },
      // 天数、重量
      {
        $addFields: {
          days: {
            $ceil: {
              $divide: [{
                $subtract: [endDate, '$outDate']
              }, 24*60*60*1000 ]
            }
          },
          weight: {
            $multiply: ['$entries.count', { $ifNull: [ '$weightPlan.entries.weight', '$products.weight'] } ]
          },
        }
      },
      // 关联价格
      {
        $lookup: {
          from: 'prices',
          let: { productType: '$entries.type', productName: '$entries.name', productSize: '$entries.size' },
          pipeline: [
            {
              $match: { _id: pricePlanId }
            },
            {
              $unwind: '$userPlans'
            },
            {
              $match: {
                $expr: {
                  $cond: {
                    if: {
                      $eq: ['$userPlans.level', '产品']
                    },
                    then: {
                      $and: [
                        { $eq: ['$userPlans.productType', '$$productType'] },
                        { $eq: ['$userPlans.name', '$$productName'] },
                      ]
                    },
                    else: { 
                      $and: [
                        { $eq: ['$userPlans.productType', '$$productType'] },
                        { $eq: ['$userPlans.name', '$$productName'] },
                        { $eq: ['$userPlans.size', '$$productSize'] },
                      ]
                    }
                  },
                }
              }
            }
          ],
          as: 'prices'
        }
      },
      {
        $unwind: {
          path: '$prices',
        }
      },
      //
      {
        $addFields: {
          count: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$prices.userPlans.type', '换算数量'] },
                  then: { $multiply: ['$entries.count', '$products.scale', '$inOut'] },
                },
                {
                  case: { $eq: ['$prices.userPlans.type', '数量'] },
                  then: { $multiply: ['$entries.count', '$inOut'] },
                },
                {
                  case: { $eq: ['$prices.userPlans.type', '重量'] },
                  then: { $multiply: ['$weight', '$inOut'] },
                },
              ],
              default:  {
                $cond: {
                  if: '$products.isScaled',
                  then: {
                    $multiply: ['$entries.count', '$products.scale', '$inOut']
                  },
                  else: { $multiply: ['$entries.count', '$inOut'] }
                }
              }
            }
          },
          unit: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$prices.userPlans.type', '换算数量'] },
                  then: '$products.unit',
                },
                {
                  case: { $eq: ['$prices.userPlans.type', '数量'] },
                  then: '$products.countUnit',
                },
                {
                  case: { $eq: ['$prices.userPlans.type', '重量'] },
                  then: '千克',
                },
              ],
              default:  {
                $cond: {
                  if: '$products.isScaled',
                  then: '$products.unit',
                  else: '$products.countUnit',
                }
              }
            }
          },
        }
      },
      {
        $addFields: {
          price: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$prices.userPlans.type', '换算数量'] },
                  then: { $multiply: ['$entries.count', '$products.scale', '$prices.userPlans.unitPrice', '$days', '$inOut'] },
                },
                {
                  case: { $eq: ['$prices.userPlans.type', '数量'] },
                  then: { $multiply: ['$entries.count', '$prices.userPlans.unitPrice', '$days', '$inOut'] },
                },
                {
                  case: { $eq: ['$prices.userPlans.type', '重量'] },
                  then: { $multiply: ['$weight', '$prices.userPlans.unitPrice', '$days', '$inOut'] },
                },
              ],
              default: 0
            }
          },
          freight: {
            $cond: {
              if: {
                $or: [
                  {
                    $and: [
                      { $in: ['$prices.freightType', ['出库', '双向']] },
                      { $eq: ['$inOut', 1] },
                    ],
                  },
                  {
                    $and: [
                      { $in: ['$prices.freightType', ['入库', '双向']] },
                      { $eq: ['$inOut', -1] },
                    ],
                  }
                ]
              },
              then: { $multiply: ['$weight', '$prices.freight', 0.001] },
              else: 0,
            },
          }
        }
      },
      {
        $facet: {
          history: [
            {
              $match: {
                history: true
              },
            },
            {
              // TODO 考虑不合并的情况
              $group: {
                _id: '$products.name',
                name: {
                  $first: '$products.name',
                },
                count: {
                  $sum: '$count',
                },
                days: {
                  $first: '$days',
                },
                price: {
                  $sum: {
                    $multiply: [ '$prices.userPlans.unitPrice', '$days', '$count' ],
                  }
                },
                unit: {
                  $first: '$unit'
                },
              }
            },
            {
              $match: {
                count: {
                  $ne: 0
                }
              }
            },
            {
              $addFields: {
                unitPrice: {
                  $divide: [
                    {
                      $divide: [
                        '$price', '$count',
                      ],
                    },
                    '$days',
                  ],
                }
              }
            }
          ],
          list: [
            {
              $match: {
                history: false
              }
            },
            {
              $project: {
                outDate: '$outDate',
                number: '$entries.number',
                name: '$products.name',
                size: '$products.size',
                count: '$count',
                days: '$days',
                inOut: { $cond: { if: { $eq: ['$inOut', 1] }, then: '出库', else: '入库' } },
                unitPrice: '$prices.userPlans.unitPrice',
                unitFreight: '$prices.freight',
                price: '$price',
                freight: '$freight',
                history: '$history',
                unit: '$unit',
              }
            },
            {
              $group: {
                // TODO 考虑不合并的情况
                _id: {
                  year: { $year: { date: '$outDate', timezone: 'Asia/Shanghai' } },
                  month: { $month: { date: '$outDate', timezone: 'Asia/Shanghai' } },
                  day: { $dayOfMonth: { date: '$outDate', timezone: 'Asia/Shanghai' } },
                  name: '$name',
                  inOut: '$inOut',
                },
                outDate: { $first: '$outDate' },
                number: { $first:  '$number' },
                name: { $first: '$name' },
                count: { $sum: '$count' },
                days: { $first: '$days' },
                inOut: { $first: '$inOut' },
                unitPrice: { $first: '$unitPrice' },
                unitFreight: { $first: '$freight' },
                price: { $sum: '$price' },
                freight: { $sum: '$freight' },
                unit: { $first: '$unit' },
              }
            },
            {
              $sort: {
                '_id.year': 1,
                '_id.month': 1,
                '_id.day': 1,
                number: 1,
              }
            }
          ],
          nameGroup: [
            {
              $project: {
                name: '$products.name',
                count: '$count',
                unit: '$unit',
              },
            },
            {
              $group: {
                _id: {
                  name: '$name',
                },
                name: { $first: '$name' },
                count: { $sum: '$count' },
                unit: { $first: '$unit' },
              }
            },
          ],
          group: [
            {
              $group: {
                _id: null,
                price: {
                  $sum: '$price'
                },
              }
            }
          ],
          freightGroup: [
            {
              $match: {
                history: false,
              },
            },
            {
              $group: {
                _id: null,
                freight: {
                  $sum: '$freight'
                },
              }
            },
          ]
        }
      }
    ])
    const price = _.get(result, '0.group.0.price', 0)
    const freight = _.get(result, '0.freightGroup.0.freight', 0)
    return {
      history: result[0].history,
      list: result[0].list,
      group: {
        price,
        freight,
      },
      nameGroup: result[0].nameGroup,
      freightGroup: result[0].freightGroup,
    }
  }

  async queryStock(projectId: string) {
    const expr = []
    const project = Types.ObjectId(projectId)
    // TODO 过滤出合适的表单
    // 选出需要计算的 project 的所有相关数据
    expr.push({
      $match: {
        $or: [
          {
            inStock: project,
          },
          {
            outStock: project,
          },
        ]
      }
    })
    // 计算出入库
    expr.push(
      {
        $addFields: {
          inOut: {
            $cond: {
              if: {
                $eq: ['$inStock', project]
              },
              then: 1,
              else: -1,
            }
          }
        }
      },
    )
    // 拉出子表单
    expr.push(
      {
        $unwind: '$entries'
      },
    )
    const result = await this.recordModel.aggregate(expr)
    return result
  }
}