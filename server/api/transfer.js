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
  record.username = historyRecord.username = req.session.user.username

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
  let transfer = req.body
  delete transfer._id // 删除 _id 否则正在创建历史记录时会出问题

  Record.findById(req.params.id).then(record => {
    Object.assign(record, transfer)
    let historyRecord = new HistoryRecord(transfer)
    historyRecord.type = '调拨'
    historyRecord.order = record._id
    historyRecord.status  = record.status
    record.username = historyRecord.username = req.session.user.username
    return Promise.all([record.save(), historyRecord.save()])
  }).then(([record, historyRecord]) => {
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

exports.updateTransport = (req, res, next) => {
  Record.findById(req.params.id).then(record => {
    Object.assign(record.transport, req.body)
    record.hasTransport = true
    return record.save()
  }).then(record => {
    res.json({
      message: '保存运输单成功',
      data: {
        record
      }
    })
  }).catch(err => {
    next(err)
  })
}
