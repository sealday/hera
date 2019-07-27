const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment')

const Record = require('../models').Record
const helper = require('../utils/my').helper

const RecordCount = async (storeId, direction, dateType) => {
  let today = moment().startOf('day').toDate()
  if (direction) {
    return Record.count({
      [direction]: ObjectId(storeId),
      [dateType]: {
        '$gte': today,
      },
    })
  } else {
    return Record.count({
      [dateType]: {
        '$gte': today,
      },
      '$where': 'this.updatedAt > this.createdAt',
    })
  }
}

/**
 * 计算今日订单入库新增量
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const newInRecords = async (req, res) => {
  let storeId = req.query['store']
  const num = await RecordCount(storeId, 'inStock', 'createdAt')
  res.json({
    data: {
      num,
    }
  })
}

/**
 * 计算今日订单出库新增量
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const newOutRecords = async (req, res) => {
  let storeId = req.query['store']
  const num = await RecordCount(storeId, 'outStock', 'createdAt')
  res.json({
    data: {
      num,
    }
  })
}

/**
 * 计算今日订单更新量
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const updateRecords = async (req, res) => {
  let storeId = req.query['store']
  const num = await RecordCount(storeId, null, 'updatedAt')
  res.json({
    data: {
      num,
    }
  })
}

exports.newInRecords = helper(newInRecords)
exports.newOutRecords = helper(newOutRecords)
exports.updateRecords = helper(updateRecords)
