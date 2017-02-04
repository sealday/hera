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

  // FIXME 考虑使用更合理的字段，比如 type
  if (record.vendor) { // 如果有填写对方单位（vendor）字段，那么就属于采购和销售
    if (record.inStock) {
      record.type = historyRecord.type = '采购'
      record.status = historyRecord.status = '未支付'
    } else if (record.outStock) {
      record.type = historyRecord.type = '销售'
      record.status = historyRecord.status = '未支付'
    } else {
      return res.status(400).json({
        message: '请求参数有误！'
      })
    }
  } else {
    record.type = historyRecord.type = '调拨'
    record.status = historyRecord.status = '未确认'
  }

  record.order = historyRecord.order = record._id
  record.username = historyRecord.username = req.session.user.username

  Promise.all([record.save(), historyRecord.save()]).then(([record]) => {
    res.json({
      message: '创建' + record.type + '单成功！',
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
    historyRecord.order = record._id
    historyRecord.status  = record.status
    record.username = historyRecord.username = req.session.user.username
    return Promise.all([record.save(), historyRecord.save()])
  }).then(([record]) => {
    res.json({
      message: '更新' + record.type +'成功！',
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
