const _ = require('lodash')

const Record = require('../models').Record
const Price = require('../models').Price

class Rent {
  async calculate({startDate, endDate, timezone, project, pricePlanId})  {
    const pricePlan = await Price.findOne({ _id: pricePlanId })
    const weightPlanId = pricePlan.weightPlan
    const result = await Record.aggregate([
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
          from: 'weights',
          let: { productType: '$entries.type', productName: '$entries.name', productSize: '$entries.size' },
          pipeline: [
            {
              $match: { _id: weightPlanId },
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
            $multiply: ['$entries.count', { $ifNull: [ '$weightPlan.entries.unitWeight', '$products.weight'] } ]
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
}

module.exports = new Rent()
