import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Record } from 'src/app/app.service';
import { LoggerService } from 'src/app/logger/logger.service';
import { User } from 'src/users/users.service';
import moment = require('moment');

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
    // 查询回单、存根联
    _.forEach(['receipt', 'counterfoil'], key => {
      if (key in condition) {
        if (condition[key]=== '已签收') {
          match[key] = true
        } else if (condition[key]=== '未签收') {
          match[key] = {
            $in: [false, undefined]
          }
        }
      }
    })
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
    // 查询承运方
    if (condition.carrierParty) {
      match['transport.carrier-party'] = condition.carrierParty
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
  async calculate({ startDate, endDate, project, user, rules, rentCalculation }) {
    this.loggerService.logInfo(user, '查询', { message: '计算租金信息' })
    // 计算days使用结束时间
    // 在原有endDate上进行加一天，减去一天
    // 0 不用处理，1 则在endDate上加一天时间， 2 则在endDate上减去一天的时间
    const endStateDate = rentCalculation ? rentCalculation === 1 ? new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000) : new Date(new Date(endDate).getTime() - 24 * 60 * 60 * 1000) : endDate  
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
      {
        $addFields: {
          entriesLength: {
            $size: '$entries'
          }
        },
      },
      {
        $addFields: {
          actualWeight:
          {
            $cond: {
              if: {
                $gt: ['$entriesLength', 0]
              },
              then: {
                $divide: ['$weight', '$entriesLength']
              },
              // 这里取 0 或者取 weight 都可以，既然没有东西也不应该有重量？
              else: 0
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
      // 天数、重量
      {
        $addFields: {
          days: {
            $ceil: {
              $divide: [{
                $subtract: [endStateDate, '$outDate']
              }, 24 * 60 * 60 * 1000]
            }
          },
          weight: {
            $multiply: [
              '$entries.count',
              { $ifNull: ['$weightRule.items.weight', '$products.weight'] },
              {
                $cond: {
                  if: {
                    $eq: ['$weightRule.items.countType', '换算数量'],
                  },
                  then: '$products.scale',
                  else: 1,
                }
              }
            ]
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
                {
                  case: { $eq: ['$rentRule.items.countType', '实际重量'] },
                  then: { $multiply: ['$actualWeight', '$inOut', 1000] },
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
                {
                  case: { $eq: ['$rentRule.items.countType', '实际重量'] },
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
                {
                  case: { $eq: ['$rentRule.items.countType', '实际重量'] },
                  then: { $multiply: ['$actualWeight', '$rentRule.items.unitPrice', '$days', '$inOut', 1000] },
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
                $or: [
                  {
                    count: {
                      $gt: 0.000001,
                    }
                  },
                  {
                    count: {
                      $lt: -0.000001
                    }
                  }
                ]
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
            {
              $match: {
                $or: [
                  {
                    count: {
                      $gt: 0.000001,
                    }
                  },
                  {
                    count: {
                      $lt: -0.000001
                    }
                  }
                ]
              }
            },
          ],
        }
      }
    ])
    // 有关联的结果（手动输入）
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
              $match: { _id: rules['非租'].weight },
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
      // 天数、重量
      {
        $addFields: {
          weight: {
            $multiply: [
              '$complements.count',
              { $ifNull: ['$weightRule.items.weight', '$products.weight'] },
              {
                $cond: {
                  if: {
                    $eq: ['$weightRule.items.countType', '换算数量'],
                  },
                  then: '$products.scale',
                  else: 1,
                }
              }
            ]
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
              $match: { _id: rules['非租'].fee }
            },
            {
              $unwind: '$items'
            },
            {
              $match: {
                'items.countSource': '手动输入'
              }
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
      // 关联费用表
      {
        $lookup: {
          from: 'others',
          let: { otherId: { $last: '$complements.product' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$id', '$$otherId'] },
                  ]
                }
              }
            }
          ],
          as: 'other',
        }
      },
      {
        $unwind: '$other'
      },
      // 关联费用类别
      {
        $lookup: {
          from: 'others',
          let: { otherId: { $first: '$complements.product' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$id', '$$otherId'] },
                  ]
                }
              }
            }
          ],
          as: 'categories',
        }
      },
      {
        $unwind: '$categories'
      },
      {
        $group: {
          _id: {
            year: { $year: { date: '$outDate', timezone: 'Asia/Shanghai' } },
            month: { $month: { date: '$outDate', timezone: 'Asia/Shanghai' } },
            day: { $dayOfMonth: { date: '$outDate', timezone: 'Asia/Shanghai' } },
            name: { $concat: ['$complements.associate.name', '-', '$other.name'] },
            category: '$categories.name',
            unit: {
              $cond: {
                if: '$other.isAssociated',
                then:  {
                  $cond: {
                    if: {
                      $eq: ['$otherRule.items.countType', '重量']
                    },
                    then: '千克',
                    else: {
                      $cond: {
                        if: '$products.isScaled',
                        then: '$products.unit',
                        else: '$products.countUnit'
                      }
                    }
                  }
                },
                else: '$other.unit'
              }
            }
          },
          outDate: { $first: '$outDate' },
          number: { $first: '$number' },
          count: { $sum: '$count' },
          unitPrice: { $first: '$otherRule.items.unitPrice' },
          price: { $sum: '$price' },
        }
      },
      {
        $addFields: {
          name: '$_id.name',
          category: '$_id.category',
          unit: '$_id.unit',
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
          name: 1,
          category: 1,
        }
      }
    ])
    // 有关联的结果（按出入库数量计算）
    const otherAssociatedResultPerOrder = await this.recordModel.aggregate([
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
          direction: {
            $cond: {
              if: {
                $eq: ['$inStock', project]
              },
              then: 'out',
              else: 'in',
            }
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
              $match: { _id: rules['非租'].weight },
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
      // 天数、重量
      {
        $addFields: {
          weight: {
            $multiply: [
              '$entries.count',
              { $ifNull: ['$weightRule.items.weight', '$products.weight'] },
              {
                $cond: {
                  if: {
                    $eq: ['$weightRule.items.countType', '换算数量'],
                  },
                  then: '$products.scale',
                  else: 1,
                }
              }
            ]
          },
        }
      },
      // 关联价格
      {
        $lookup: {
          from: 'rules',
          let: {
            associateType: '$entries.type', 
            associateName: '$entries.name', 
            associateSize: '$entries.size',
          },
          pipeline: [
            {
              $match: { _id: rules['非租'].fee }
            },
            {
              $unwind: '$items'
            },
            {
              $match: {
                'items.countSource':  { $ne: '手动输入' },
              }
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
                      ]
                    },
                    else: {
                      $and: [
                        { $eq: ['$items.associate.type', '$$associateType'] },
                        { $eq: ['$items.associate.name', '$$associateName'] },
                        { $eq: ['$items.associate.size', '$$associateSize'] },
                        { $eq: ['$items.level', '规格'] },
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
      // 过滤 countSource
      {
        $match: {
          $expr: {
            $or: [
              {
                $and: [
                  {
                    $eq: ['$otherRule.items.countSource', '出入库数量']
                  },
                  {
                    $or: [
                      {
                        $eq: ['$direction', 'in']
                      },
                      {
                        $eq: ['$direction', 'out']
                      },
                    ]
                  }
                ]
              },
              {
                $and: [
                  {
                    $eq: ['$otherRule.items.countSource', '出库数量']
                  },
                  {
                    $or: [
                      {
                        $eq: ['$direction', 'out']
                      },
                    ]
                  }
                ]
              },
              {
                $and: [
                  {
                    $eq: ['$otherRule.items.countSource', '入库数量']
                  },
                  {
                    $or: [
                      {
                        $eq: ['$direction', 'in']
                      },
                    ]
                  }
                ]
              },
              {
                $and: [
                  {
                    $eq: ['$otherRule.items.countSource', '合同运费']
                  },
                  {
                    $or: [
                      {
                        $eq: ['$freight', true]
                      },
                    ]
                  }
                ]
              },
            ]
          }
        }
      },
      {
        $addFields: {
          count: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$otherRule.items.countType', '换算数量'] },
                  then: { $multiply: ['$entries.count', '$products.scale', '$inOut'] },
                },
                {
                  case: { $eq: ['$otherRule.items.countType', '数量'] },
                  then: { $multiply: ['$entries.count', '$inOut'] },
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
                  then: { $multiply: ['$entries.count', '$products.scale', '$otherRule.items.unitPrice', '$inOut'] },
                },
                {
                  case: { $eq: ['$otherRule.items.countType', '数量'] },
                  then: { $multiply: ['$entries.count', '$otherRule.items.unitPrice', '$inOut'] },
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
      // 关联费用表
      {
        $lookup: {
          from: 'others',
          let: { otherId: { $last: '$otherRule.items.other' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$id', '$$otherId'] },
                  ]
                }
              }
            }
          ],
          as: 'other',
        }
      },
      {
        $unwind: '$other'
      },
      // 关联费用类别
      {
        $lookup: {
          from: 'others',
          let: { otherId: { $first: '$otherRule.items.other' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$id', '$$otherId'] },
                  ]
                }
              }
            }
          ],
          as: 'categories',
        }
      },
      {
        $unwind: '$categories'
      },
      {
        $group: {
          _id: {
            year: { $year: { date: '$outDate', timezone: 'Asia/Shanghai' } },
            month: { $month: { date: '$outDate', timezone: 'Asia/Shanghai' } },
            day: { $dayOfMonth: { date: '$outDate', timezone: 'Asia/Shanghai' } },
            name: { $concat: ['$entries.name', '-', '$other.name'] },
            category: '$categories.name',
            unit: {
              $cond: {
                if: '$other.isAssociated',
                then:  {
                  $cond: {
                    if: {
                      $eq: ['$otherRule.items.countType', '重量']
                    },
                    then: '千克',
                    else: {
                      $cond: {
                        if: '$products.isScaled',
                        then: '$products.unit',
                        else: '$products.countUnit'
                      }
                    }
                  }
                },
                else: '$other.unit'
              }
            }
          },
          outDate: { $first: '$outDate' },
          number: { $first: '$number' },
          count: { $sum: '$count' },
          unitPrice: { $first: '$otherRule.items.unitPrice' },
          price: { $sum: '$price' },
        }
      },
      {
        $addFields: {
          name: '$_id.name',
          category: '$_id.category',
          unit: '$_id.unit',
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
          name: 1,
          category: 1,
        }
      }
    ])
    // 按单计算
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
          direction: {
            $cond: {
              if: {
                $eq: ['$inStock', project]
              },
              then: 'out',
              else: 'in',
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
              $match: { _id: rules['非租'].weight },
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
      // 天数、重量
      {
        $addFields: {
          theoryWeight: {
            $multiply: [
              '$entries.count',
              0.001,
              { $ifNull: ['$weightRule.items.weight', '$products.weight'] },
              {
                $cond: {
                  if: {
                    $eq: ['$weightRule.items.countType', '换算数量'],
                  },
                  then: '$products.scale',
                  else: 1,
                }
              }
            ]
          },
        }
      },
      {
        $group: {
          _id: {
            number: "$number"
          },
          weight: { $first: "$weight" },
          theoryWeight: { $sum: "$theoryWeight" },
          freight: { $first: '$freight' },
          direction: { $first: '$direction' },
        }
      },
      // 关联按单
      {
        $lookup: {
          from: 'rules',
          let: { },
          pipeline: [
            {
              $match: { _id: rules['非租'].fee },
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
      // 根据条件过滤
      {
        $match: {
          $expr: {
            $or: [
              {
                $and: [
                  {
                    $eq: ['$otherRule.items.condition', '出入库']
                  },
                  {
                    $or: [
                      {
                        $eq: ['$direction', 'in']
                      },
                      {
                        $eq: ['$direction', 'out']
                      },
                    ]
                  }
                ]
              },
              {
                $and: [
                  {
                    $eq: ['$otherRule.items.condition', '出库']
                  },
                  {
                    $or: [
                      {
                        $eq: ['$direction', 'out']
                      },
                    ]
                  }
                ]
              },
              {
                $and: [
                  {
                    $eq: ['$otherRule.items.condition', '入库']
                  },
                  {
                    $or: [
                      {
                        $eq: ['$direction', 'in']
                      },
                    ]
                  }
                ]
              },
              {
                $and: [
                  {
                    $eq: ['$otherRule.items.condition', '合同运费']
                  },
                  {
                    $or: [
                      {
                        $eq: ['$freight', true]
                      },
                    ]
                  }
                ]
              },
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            number: '$_id.number',
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
            other: { $last: '$_id.other' },
          },
          count: { $sum: '$weight' },
          unitPrice: { $first: '$_id.unitPrice' },
          price: { $sum: { $multiply: ['$_id.unitPrice', '$weight'] } },
        }
      },
      // 关联费用表
      {
        $lookup: {
          from: 'others',
          let: { otherId: '$_id.other' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$id', '$$otherId'] },
                  ]
                }
              }
            }
          ],
          as: 'other',
        }
      },
      {
        $unwind: '$other'
      },
      // 关联 category
      {
        $lookup: {
          from: 'others',
          let: { categoryId: '$_id.category' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$id', '$$categoryId'] },
                  ]
                }
              }
            }
          ],
          as: 'category',
        }
      },
      {
        $unwind: '$category'
      },
      {
        $addFields: {
          category: '$category.name',
          unit: '吨',
          name: '$other.name',
          outDate: moment(endDate).add(-1, 'day').toDate(),
        }
      },
    ])
    // 按单计算
    const perOrderResult = await this.recordModel.aggregate([
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
          direction: {
            $cond: {
              if: {
                $eq: ['$inStock', project]
              },
              then: 'out',
              else: 'in',
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
              $match: { _id: rules['装卸运费'].weight },
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
      // 天数、重量
      {
        $addFields: {
          theoryWeight: {
            $multiply: [
              '$entries.count',
              0.001,
              { $ifNull: ['$weightRule.items.weight', '$products.weight'] },
              {
                $cond: {
                  if: {
                    $eq: ['$weightRule.items.countType', '换算数量'],
                  },
                  then: '$products.scale',
                  else: 1,
                }
              }
            ]
          },
        }
      },
      {
        $group: {
          _id: {
            number: "$number"
          },
          weight: { $first: "$weight" },
          theoryWeight: { $sum: "$theoryWeight" },
          freight: { $first: '$freight' },
          direction: { $first: '$direction' },
        }
      },
      // 关联按单
      {
        $lookup: {
          from: 'rules',
          let: { },
          pipeline: [
            {
              $match: { _id: rules['装卸运费'].fee },
            },
            {
              $unwind: '$items',
            },
          ],
          as: 'otherRule',
        }
      },
      {
        $unwind: {
          path: '$otherRule',
        }
      },
      // 根据条件过滤
      {
        $match: {
          $expr: {
            $or: [
              {
                $and: [
                  {
                    $eq: ['$otherRule.items.condition', '出入库']
                  },
                  {
                    $or: [
                      {
                        $eq: ['$direction', 'in']
                      },
                      {
                        $eq: ['$direction', 'out']
                      },
                    ]
                  }
                ]
              },
              {
                $and: [
                  {
                    $eq: ['$otherRule.items.condition', '出库']
                  },
                  {
                    $or: [
                      {
                        $eq: ['$direction', 'out']
                      },
                    ]
                  }
                ]
              },
              {
                $and: [
                  {
                    $eq: ['$otherRule.items.condition', '入库']
                  },
                  {
                    $or: [
                      {
                        $eq: ['$direction', 'in']
                      },
                    ]
                  }
                ]
              },
              {
                $and: [
                  {
                    $eq: ['$otherRule.items.condition', '合同运费']
                  },
                  {
                    $or: [
                      {
                        $eq: ['$freight', true]
                      },
                    ]
                  }
                ]
              },
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            number: '$_id.number',
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
            other: { $last: '$_id.other' },
            category: { $first: '$_id.other' },
          },
          count: { $sum: '$weight' },
          unitPrice: { $first: '$_id.unitPrice' },
          price: { $sum: { $multiply: ['$_id.unitPrice', '$weight'] } },
        }
      },
      // 关联费用表
      {
        $lookup: {
          from: 'others',
          let: { otherId: '$_id.other' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$id', '$$otherId'] },
                  ]
                }
              }
            }
          ],
          as: 'other',
        }
      },
      {
        $unwind: '$other'
      },
      // 关联 category
      {
        $lookup: {
          from: 'others',
          let: { categoryId: '$_id.category' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$id', '$$categoryId'] },
                  ]
                }
              }
            }
          ],
          as: 'category',
        }
      },
      {
        $unwind: '$category'
      },
      {
        $addFields: {
          category: '$category.name',
          unit: '吨',
          name: '$other.name',
          outDate: moment(endDate).add(-1, 'day').toDate(),
        }
      },
    ])
    const purchaseResult = await this.recordModel.aggregate([
      {
        // 关联购销单
        $match: {
          $or: [
            {
              inStock: project
            },
            {
              outStock: project
            }
          ],
          type: '购销',
          outDate: {
            $lt: endDate,
            $gte: startDate,
          }
        }
      },
      {
        $addFields: {
          minus: {
            $cond: {
              if: {
                $eq: ['$inStock', project]
              },
              then: 1,
              else: -1,
            }
          },
          inOut: {
            $cond: {
              if: {
                $eq: ['$inStock', project]
              },
              then: '出库',
              else: '入库',
            }
          },
          category: {
            $cond: {
              if: {
                $eq: ['$inStock', project]
              },
              then: '销售',
              else: '采购',
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
      {
        $addFields: {
          unit: {
            $cond: {
              if: '$products.isScaled',
              then: '$products.unit',
              else: '$products.countUnit',
            }
          },
          count: {
            $cond: {
              if: '$products.isScaled',
              then: { $multiply: ['$products.scale', '$entries.count'] },
              else: '$entries.count',
            }
          },
          unitPrice: '$entries.price',
        }
      },
      {
        $group: {
          _id: {
            outDate: '$outDate',
            inOut: '$inOut',
            unit: '$unit',
            name: '$entries.name',
            category: '$category',
            minus: '$minus',
          },
          count: {
            $sum: '$count',
          },
          // 单价这里假设都一样
          unitPrice: {
            $first: '$unitPrice',
          },
        }
      },
      {
        $project: {
          outDate: '$_id.outDate',
          inOut: '$_id.inOut',
          name: '$_id.name',
          unit: '$_id.unit',
          category: '$_id.category',
          minus: '$_id.minus',
          count: '$count',
          unitPrice: '$unitPrice',
        },
      },
      {
        $addFields: {
          price: {
            $multiply: ['$count', '$unitPrice', '$minus']
          }
        }
      },
    ])
    const extraResult = await this.recordModel.aggregate([
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
        $unwind: '$additionals'
      },
      // 关联费用表
      {
        $lookup: {
          from: 'others',
          let: { otherId: { $last: '$additionals.product' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$id', '$$otherId'] },
                  ]
                }
              }
            }
          ],
          as: 'name',
        }
      },
      {
        $unwind: '$name'
      },
      // 关联费用表
      {
        $lookup: {
          from: 'others',
          let: { otherId: { $first: '$additionals.product' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$id', '$$otherId'] },
                  ]
                }
              }
            }
          ],
          as: 'category',
        }
      },
      {
        $unwind: '$category'
      },
      {
        $project: {
          outDate: '$outDate',
          name: '$name.name',
          category: '$category.name',
          price: '$additionals.amount',
        },
      },
    ])
    const price = _.sumBy([
      ...rentResult[0].history,
      ...rentResult[0].list,
      ...purchaseResult,
      ...otherAssociatedResult,
      ...extraResult,
      ...otherAssociatedResultPerOrder,
      ...otherUnconnectedResult,
      ...perOrderResult,
    ], item => item.price)
    
    return {
      history: rentResult[0].history,
      list: _
        .sortBy(rentResult[0].list.concat(otherAssociatedResult, otherAssociatedResultPerOrder, purchaseResult, extraResult), ['outDate', 'name'])
        .concat(otherUnconnectedResult, perOrderResult),
      debug: [],
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


  async detailSearch(condition: any, user: User) {
    this.loggerService.logInfo(user, '查询', { message: '查询明细信息', payload: condition })
    const pipeline = []
    // 关联仓库/项目
    if (condition.projectId) {
      pipeline.push({
        $match: {
          $or: [
            {
              outStock: new Types.ObjectId(condition.storeId),
              inStock: new Types.ObjectId(condition.projectId),
            },
            {
              inStock: new Types.ObjectId(condition.storeId),
              outStock: new Types.ObjectId(condition.projectId),
            }
          ]
        }
      })
    } else {
      pipeline.push({
        $match: {
          $or: [
            {
              outStock: new Types.ObjectId(condition.storeId),
            },
            {
              inStock: new Types.ObjectId(condition.storeId),
            }
          ]
        }
      })
    }
    // 关联项目类型
    if (condition.projectType && !condition.projectId) {
      pipeline.push({
        $lookup: {
          from: 'projects',
          let: { inStock: '$inStock' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$inStock'] },
                  ]
                }
              }
            }
          ],
          as: 'inProject',
        }
      })
      pipeline.push({
        $unwind: '$inProject',
      })
      pipeline.push({
        $lookup: {
          from: 'projects',
          let: { outStock: '$outStock' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$outStock'] },
                  ]
                }
              }
            }
          ],
          as: 'outProject',
        }
      })
      pipeline.push({
        $unwind: '$outProject',
      })
      pipeline.push({
        $match: {
          $or: [
            {
              outStock: new Types.ObjectId(condition.storeId),
              'inProject.type': condition.projectType, 
            },
            {
              inStock: new Types.ObjectId(condition.storeId),
              'outProject.type': condition.projectType, 
            }
          ]
        }
      })
    }
    // 关联日期范围
    if (condition.startDate && condition.endDate) {
      pipeline.push({
        $match: {
          outDate: {
            $gte: new Date(condition.startDate),
            $lt: new Date(condition.endDate),
          }
        }
      })
    }
    // 前置映射
    pipeline.push({
      $addFields: {
        projectId: {
          $cond: {
            if: { $eq: ['$inStock', new Types.ObjectId(condition.storeId)] },
            then: '$outStock',
            else: '$inStock'
          }
        },

      }
    })

    // 关联
    pipeline.push({
      $unwind: '$entries'
    })
    pipeline.push({
      $match: {
        'entries.type': condition.type,
      }
    })
    if (condition.name) {
      pipeline.push({
        $match: {
          'entries.name': condition.name,
        }
      })
    }
    if (condition.size) {
      pipeline.push({
        $match: {
          'entries.size': condition.size,
        }
      })
    }
    // 后置映射
    pipeline.push({
      $project: {
        type: '$entries.type',
        name: '$entries.name',
        size: '$entries.size',
        number: '$number',
        projectId: '$projectId',
        count: '$entries.count',
        in: {
          $cond: {
            if: { $eq: ['$inStock', new Types.ObjectId(condition.storeId)] },
            then: '$entries.count',
            else: 0
          }
        },
        out: {
          $cond: {
            if: { $eq: ['$outStock', new Types.ObjectId(condition.storeId)] },
            then: '$entries.count',
            else: 0
          }
        },
      }
    })
    // 关联产品表
    pipeline.push({
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
        as: 'products',
      }
    })
    pipeline.push({
      $unwind: '$products'
    })
    // 计算结果
    pipeline.push({
      $addFields: {
        productNumber: '$products.number',
        unit: {
          $cond: {
            if: '$products.isScaled',
            then: '$products.unit',
            else: '$products.countUnit',
          }
        },
        total: {
          $cond: {
            if: '$products.isScaled',
            then: { $add: [{ $multiply: ['$in', '$products.scale'] }, { $multiply: ['$out', '$products.scale', -1] }] },
            else: { $add: ['$in', { $multiply: ['$out', -1] }] },
          }
        }
      }
    })
    // 汇总结果
    pipeline.push({
      $group: {
        _id: {
          projectId: '$projectId',
          type: '$type',
          name: '$name',
          size: '$size',
          productNumber: '$productNumber',
        },
        in: { $sum: '$in' },
        out: { $sum: '$out' },
        total: { $sum: '$total' },
        unit: { $first: '$unit' },
        numbers: { $push: '$number' },
      }
    })
    pipeline.push({
      $sort: {
        '_id.productNumber': 1
      }
    })
    // 字段映射
    pipeline.push({
      $project: {
        projectId: '$_id.projectId',
        type: '$_id.type',
        name: '$_id.name',
        size: '$_id.size',
        in: '$in',
        out: '$out',
        total: '$total',
        unit: '$unit',
        numbers: '$numbers',
      }
    })
    const result = await this.recordModel.aggregate(pipeline)
    return result
  }
}