const _ = require('lodash')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const Record = require('../models').Record

class StoreService {

  /**
   * 查询指定 project 的库存
   * @param projectId
   * @param params
   */
  async queryAll(projectId, params) {
    let aggregateExpr = [
      {
        $match: {
          valid: true,
        }
      },
      {
        $facet: {
          outRecords: [
            {
              $match: {
                outStock: ObjectId(projectId),
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
                inStock: ObjectId(projectId),
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
          type: params.type,
        }
      }
    }
    return Record.aggregate(aggregateExpr)
  }
}

module.exports = StoreService