/**
 * Created by seal on 15/01/2017.
 */

const Record = require('../models/Record').Record
const HistoryRecord = require('../models/Record').HistoryRecord

exports.list = (req, res, next) => {

  Record.find(req.query).then(records => {
    res.json({
      data: {
        records
      }
    })
  }).catch(err => {
    next(err)
  })
}

/*
客户端传来 inStock 和 outStock，这里不判断是调入还是调出
 */
exports.create = (req, res, next) => {
  let record = new Record(req.body)
  let historyRecord = new HistoryRecord(req.body)

  record.type = historyRecord.type = '调拨'
  record.order = historyRecord.order = record._id
  record.status = historyRecord.status = '未确认'

  Promise.all([record.save(), historyRecord.save()]).then(([record]) => {
    res.json({
      message: '创建调拨单成功！',
      data: {
        record
      }
    })
  }).catch(err => {
    next(err)
  })
}

exports.detail = (req, res, next) => {
  Record.findById(req.params.id).then(record => {
    res.json({
      data: {
        record
      }
    })
  }).catch(err => {
    next(err)
  })
}

exports.update = (req, res, next) => {
  Record.findById(req.params.id).then(record => {
    Object.assign(record, req.body)
    return record.save()
  }).then(record => {
    res.json({
      message: '更新调拨单成功！',
      data: {
        record
      }
    })
  }).catch(err => {
    next(err)
  })
}
