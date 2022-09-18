import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Record } from 'src/app/app.service';
import { LoggerService } from 'src/app/logger/logger.service';
import { User } from 'src/users/users.service';

@Injectable()
export class StoreService {
  constructor(
    private loggerService: LoggerService,
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
                outStock: new Types.ObjectId(projectId),
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
                inStock: new Types.ObjectId(projectId),
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
      const id = new Types.ObjectId(condition.other)
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
            { inStock: id, outStock: new Types.ObjectId(condition.self) },
          ]
        } else if (condition.inOut == '入库') {
          match['$or'] = [
            { outStock: id, inStock: new Types.ObjectId(condition.self) },
          ]
        } else {
          match['$or'] = [
            { outStock: id, inStock: new Types.ObjectId(condition.self) },
            { inStock: id, outStock: new Types.ObjectId(condition.self) },
          ]
        }
      }
    } else {
      // 如果不是公司角度搜索，加限制条件
      if (!condition.company) {
        // 处理出入库
        if (condition.inOut == '出库') {
          match['$or'] = [
            { outStock: new Types.ObjectId(condition.self) },
          ]
        } else if (condition.inOut == '入库') {
          match['$or'] = [
            { inStock: new Types.ObjectId(condition.self) },
          ]
        } else {
          match['$or'] = [
            { inStock: new Types.ObjectId(condition.self) },
            { outStock: new Types.ObjectId(condition.self) },
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
  async calculate({ startDate, endDate, project, user, rules }) {
    this.loggerService.logInfo(user, '查询', { message: '计算租金信息' })
    const commonPart = [
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
      // 关联单位数量
      {
        $lookup: {
          from: 'products',
          let: { productType: '$entries.type', productName: '$entries.name', productSize: '$entries.size' },
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
          as: 'products',
        }
      },
      {
        $unwind: '$products'
      },
      // 关联重量
      {
        $lookup: {
          from: 'rules',
          let: { productType: '$entries.type', productName: '$entries.name', productSize: '$entries.size' },
          pipeline: [
            {
              $match: { _id: rules.weight },
            },
            {
              $unwind: '$items',
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$items.product.type', '$$productType'] },
                    { $eq: ['$items.product.name', '$$productName'] },
                    { $eq: ['$items.product.size', '$$productSize'] },
                  ]
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
      // 天数、重量
      {
        $addFields: {
          days: {
            $ceil: {
              $divide: [{
                $subtract: [endDate, '$outDate']
              }, 24 * 60 * 60 * 1000]
            }
          },
          weight: {
            $multiply: ['$entries.count', { $ifNull: ['$weightRule.items.weight', '$products.weight'] }]
          },
        }
      },
    ]
    const rentResult = await this.recordModel.aggregate([
      ...commonPart,
      // 关联价格
      {
        $lookup: {
          from: 'rules',
          let: { productType: '$entries.type', productName: '$entries.name', productSize: '$entries.size' },
          pipeline: [
            {
              $match: { _id: rules.rent }
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
        }
      },
      //
      {
        $addFields: {
          count: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$rentRule.items.countType', '换算数量'] },
                  then: { $multiply: ['$entries.count', '$products.scale', '$inOut'] },
                },
                {
                  case: { $eq: ['$rentRule.items.countType', '数量'] },
                  then: { $multiply: ['$entries.count', '$inOut'] },
                },
                {
                  case: { $eq: ['$rentRule.items.countType', '重量'] },
                  then: { $multiply: ['$weight', '$inOut'] },
                },
              ],
              default: {
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
                  case: { $eq: ['$rentRule.items.countType', '换算数量'] },
                  then: '$products.unit',
                },
                {
                  case: { $eq: ['$rentRule.items.countType', '数量'] },
                  then: '$products.countUnit',
                },
                {
                  case: { $eq: ['$rentRule.items.countType', '重量'] },
                  then: '千克',
                },
              ],
              default: {
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
                  case: { $eq: ['$rentRule.items.countType', '换算数量'] },
                  then: { $multiply: ['$entries.count', '$products.scale', '$rentRule.items.unitPrice', '$days', '$inOut'] },
                },
                {
                  case: { $eq: ['$rentRule.items.countType', '数量'] },
                  then: { $multiply: ['$entries.count', '$rentRule.items.unitPrice', '$days', '$inOut'] },
                },
                {
                  case: { $eq: ['$rentRule.items.countType', '重量'] },
                  then: { $multiply: ['$weight', '$rentRule.items.unitPrice', '$days', '$inOut'] },
                },
              ],
              default: 0
            }
          },
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
                    $multiply: ['$rentRule.items.unitPrice', '$days', '$count'],
                  }
                },
                unit: {
                  $first: '$unit'
                },
                category: { $first: '$rentRule.category' }
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
                unitPrice: '$rentRule.items.unitPrice',
                price: '$price',
                history: '$history',
                unit: '$unit',
                category: '$rentRule.category',
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
                number: { $first: '$number' },
                name: { $first: '$name' },
                count: { $sum: '$count' },
                days: { $first: '$days' },
                inOut: { $first: '$inOut' },
                unitPrice: { $first: '$unitPrice' },
                price: { $sum: '$price' },
                unit: { $first: '$unit' },
                category: { $first: '$category' }
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
        }
      }
    ])
    // 有关联的结果
    const otherAssociatedResult = await this.recordModel.aggregate([
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
            $gte: startDate,
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
              // 都设置为 1 让计算结果忽略这部分
              then: 1,
              else: 1
            }
          }
        }
      },
      // 展开明细
      {
        $unwind: '$complements'
      },
      {
        $match: {
          'complements.level': 'associated'
        }
      },
      // 关联单位数量
      {
        $lookup: {
          from: 'products',
          let: { productType: '$complements.associate.type', productName: '$complements.associate.name', productSize: '$complements.associate.size' },
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
          as: 'products',
        }
      },
      {
        $unwind: '$products'
      },
      // 关联重量
      {
        $lookup: {
          from: 'rules',
          let: { productType: '$complements.associate.type', productName: '$complements.associate.name', productSize: '$complements.associate.size' },
          pipeline: [
            {
              $match: { _id: rules.weight },
            },
            {
              $unwind: '$items',
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$items.product.type', '$$productType'] },
                    { $eq: ['$items.product.name', '$$productName'] },
                    { $eq: ['$items.product.size', '$$productSize'] },
                  ]
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
      // 天数、重量
      {
        $addFields: {
          weight: {
            $multiply: ['$complements.count', { $ifNull: ['$weightRule.items.weight', '$products.weight'] }]
          },
        }
      },
      // 关联价格
      {
        $lookup: {
          from: 'rules',
          let: {
            associateType: '$complements.associate.type', associateName: '$complements.associate.name', associateSize: '$complements.associate.size',
            other: '$complements.product',
          },
          pipeline: [
            {
              $match: { _id: rules.other }
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
                        { $eq: ['$items.associate.type', '$$associateType'] },
                        { $eq: ['$items.associate.name', '$$associateName'] },
                        { $eq: ['$items.level', '产品'] },
                        { $eq: ['$items.other', '$$other'] },
                      ]
                    },
                    else: {
                      $and: [
                        { $eq: ['$items.associate.type', '$$associateType'] },
                        { $eq: ['$items.associate.name', '$$associateName'] },
                        { $eq: ['$items.associate.size', '$$associateSize'] },
                        { $eq: ['$items.level', '规格'] },
                        { $eq: ['$items.other', '$$other'] },
                      ]
                    }
                  },
                }
              }
            }
          ],
          as: 'otherRule'
        }
      },
      {
        $unwind: {
          path: '$otherRule',
        }
      },
      //
      {
        $addFields: {
          count: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$otherRule.items.countType', '换算数量'] },
                  then: { $multiply: ['$complements.count', '$products.scale', '$inOut'] },
                },
                {
                  case: { $eq: ['$otherRule.items.countType', '数量'] },
                  then: { $multiply: ['$complements.count', '$inOut'] },
                },
                {
                  case: { $eq: ['$otherRule.items.countType', '重量'] },
                  then: { $multiply: ['$weight', '$inOut'] },
                },
              ],
              default: {
                $cond: {
                  if: '$products.isScaled',
                  then: {
                    $multiply: ['$complements.count', '$products.scale', '$inOut']
                  },
                  else: { $multiply: ['$complements.count', '$inOut'] }
                }
              }
            }
          },
          unit: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$otherRule.items.countType', '换算数量'] },
                  then: '$products.unit',
                },
                {
                  case: { $eq: ['$otherRule.items.countType', '数量'] },
                  then: '$products.countUnit',
                },
                {
                  case: { $eq: ['$otherRule.items.countType', '重量'] },
                  then: '千克',
                },
              ],
              default: {
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
                  case: { $eq: ['$otherRule.items.countType', '换算数量'] },
                  then: { $multiply: ['$complements.count', '$products.scale', '$otherRule.items.unitPrice', '$inOut'] },
                },
                {
                  case: { $eq: ['$otherRule.items.countType', '数量'] },
                  then: { $multiply: ['$complements.count', '$otherRule.items.unitPrice', '$inOut'] },
                },
                {
                  case: { $eq: ['$otherRule.items.countType', '重量'] },
                  then: { $multiply: ['$weight', '$otherRule.items.unitPrice', '$inOut'] },
                },
              ],
              default: 0
            }
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: { date: '$outDate', timezone: 'Asia/Shanghai' } },
            month: { $month: { date: '$outDate', timezone: 'Asia/Shanghai' } },
            day: { $dayOfMonth: { date: '$outDate', timezone: 'Asia/Shanghai' } },
            name: {
              $reduce: {
                input: '$complements.product',
                initialValue: '',
                in: { $concat: ["$$value", " / ", "$$this"] }
              }
            }
          },
          outDate: { $first: '$outDate' },
          number: { $first: '$number' },
          count: { $sum: '$count' },
          unitPrice: { $first: '$otherRule.items.unitPrice' },
          price: { $sum: '$price' },
          unit: { $first: '$unit' },
          category: { $first: '$otherRule.category' }
        }
      },
      {
        $addFields: {
          name: '$_id.name'
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
    ])
    const otherUnconnectedResult = await this.recordModel.aggregate([
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
            $gte: startDate,
          }
        }
      },
      {
        $addFields: {
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
      // 关联单位数量
      {
        $lookup: {
          from: 'products',
          let: { productType: '$entries.type', productName: '$entries.name', productSize: '$entries.size' },
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
          as: 'products',
        }
      },
      {
        $unwind: '$products'
      },
      // 关联重量
      {
        $lookup: {
          from: 'rules',
          let: { productType: '$entries.type', productName: '$entries.name', productSize: '$entries.size' },
          pipeline: [
            {
              $match: { _id: rules.weight },
            },
            {
              $unwind: '$items',
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$items.product.type', '$$productType'] },
                    { $eq: ['$items.product.name', '$$productName'] },
                    { $eq: ['$items.product.size', '$$productSize'] },
                  ]
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
      // 天数、重量
      {
        $addFields: {
          days: {
            $ceil: {
              $divide: [{
                $subtract: [endDate, '$outDate']
              }, 24 * 60 * 60 * 1000]
            }
          },
          theoryWeight: {
            $multiply: ['$entries.count', { $ifNull: ['$weightRule.items.weight', '$products.weight'] }]
          },
        }
      },
      // 关联按单
      {
        $lookup: {
          from: 'rules',
          let: { },
          pipeline: [
            {
              $match: { _id: rules.other },
            },
            {
              $unwind: '$items',
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$items.level', '按单'] },
                  ]
                }
              }
            }
          ],
          as: 'otherRule',
        }
      },
      {
        $unwind: {
          path: '$otherRule',
        }
      },
      {
        $group: {
          _id: {
            number: '$number',
            outDate: '$outDate',
            other: '$otherRule.items.other',
            unitPrice: '$otherRule.items.unitPrice',
            category: '$otherRule.category',
          },
          weight: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$otherRule.items.countType', '重量']
                },
                then: '$theoryWeight',
                else: '$weight'
              }
            }
          }
        }
      },
      {
        $group: {
          _id: {
            other: '$_id.other',
          },
          count: { $sum: '$weight' },
          unitPrice: { $first: '$_id.unitPrice' },
          price: { $sum: { $multiply: ['$_id.unitPrice', '$weight'] } },
          category: { $first: '$_id.category' }
        }
      },
      {
        $addFields: {
          name: { 
            $reduce: {
              input: '$_id.other',
              initialValue: '',
              in: { $concat: ["$$value", " / ", "$$this"] }
            }
           },
          outDate: '本期发生'
        }
      },
    ])
    const price = _.sumBy([
      ...rentResult[0].history,
      ...rentResult[0].list,
      ...otherAssociatedResult,
      ...otherUnconnectedResult
    ], item => item.price)
    return {
      history: rentResult[0].history.concat(otherUnconnectedResult),
      list: rentResult[0].list.concat(otherAssociatedResult),
      debug: otherUnconnectedResult,
      group: {
        price,
      },
      nameGroup: rentResult[0].nameGroup,
    }
  }

  async queryStock(projectId: string) {
    const expr = []
    const project = new Types.ObjectId(projectId)
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
    // 映射结果
    expr.push({
      $project: {
        name: '$entries.name',
        size: '$entries.size',
        count: { $multiply: ['$entries.count', '$inOut'] },
      }
    })
    // 汇总
    expr.push({

    })
    const result = await this.recordModel.aggregate(expr)
    return result
  }
}