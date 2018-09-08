const Record = require('../models').Record

class Rent {
  async calculate({startDate, endDate, timezone, project, pricePlanId})  {
    return Record.aggregate([
      {
        $match: {
          $or: [
            {
              inStock: project
            },
            {
              outStock: project
            }
          ],
          outDate: {
            $lt: endDate,
          }
        }
      },
      {
        $addFields: {
          history: {
            $lt: ['$outDate', startDate]
          },
        }
      },
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
        $unwind: '$entries'
      },
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
            $multiply: ['$entries.count', '$products.weight']
          },
        }
      },
      {
        $lookup: {
          from: 'prices',
          let: { number: '$products.number' },
          pipeline: [
            {
              $match: { _id: pricePlanId }
            },
            {
              $unwind: '$entries'
            },
            {
              $match: {
                $expr: {
                  $eq: ['$entries.number', '$$number']
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
      {
        $addFields: {
          count: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$prices.entries.type', '换算数量'] },
                  then: { $multiply: ['$entries.count', '$products.scale', '$inOut'] },
                },
                {
                  case: { $eq: ['$prices.entries.type', '数量'] },
                  then: { $multiply: ['$entries.count', '$inOut'] },
                },
                {
                  case: { $eq: ['$prices.entries.type', '重量'] },
                  then: { $multiply: ['$entries.count', '$products.weight', '$inOut'] },
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
                  case: { $eq: ['$prices.entries.type', '换算数量'] },
                  then: '$products.unit',
                },
                {
                  case: { $eq: ['$prices.entries.type', '数量'] },
                  then: '$products.countUnit',
                },
                {
                  case: { $eq: ['$prices.entries.type', '重量'] },
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
                  case: { $eq: ['$prices.entries.type', '换算数量'] },
                  then: { $multiply: ['$entries.count', '$products.scale', '$prices.entries.unitPrice', '$days', '$inOut'] },
                },
                {
                  case: { $eq: ['$prices.entries.type', '数量'] },
                  then: { $multiply: ['$entries.count', '$prices.entries.unitPrice', '$days', '$inOut'] },
                },
                {
                  case: { $eq: ['$prices.entries.type', '重量'] },
                  then: { $multiply: ['$entries.count', '$products.weight', '$prices.entries.unitPrice', '$days', '$inOut'] },
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
              then: { $multiply: ['$entries.count', '$products.weight', '$prices.freight', 0.001] },
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
                    $multiply: [ '$prices.entries.unitPrice', '$days', '$count' ],
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
                unitPrice: '$prices.entries.unitPrice',
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
                  inOut: { $cond: { if: { $eq: ['$inOut', 1] }, then: '出库', else: '入库' } }
                },
                outDate: { $first: '$outDate' },
                number: { $first:  '$number' },
                name: { $first: '$name' },
                count: { $sum: '$count' },
                days: { $first: '$days' },
                inOut: { $first: { $cond: { if: { $eq: ['$inOut', 1] }, then: '出库', else: '入库' } } },
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
          group: [
            {
              $group: {
                _id: null,
                price: {
                  $sum: '$price'
                },
                freight: {
                  $sum: '$freight'
                },
              }
            }
          ]
        }
      }
    ])
  }
}

module.exports = new Rent()
