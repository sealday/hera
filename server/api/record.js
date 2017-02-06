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

  switch (record.type) {
    case '采购':
      record.status = historyRecord.status = '未支付'
      break
    case '销售':
      record.status = historyRecord.status = '未支付'
      break
    case '调拨':
      record.status = historyRecord.status = '未确认'
      break
    default:
      return res.status(400).json({
        message: '请求参数有误！'
      })
  }

  // 内部单号
  record.order = historyRecord.order = record._id
  // 制单人
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
  let recordBody = req.body
  delete recordBody._id // 删除 _id 否则正在创建历史记录时会出问题（允许客户端提交 _id 但是进行忽略)

  if (!req.params.id) {
    return res.status(400).json({
      message: '请求参数有误！'
    })
  }

  Record.findById(req.params.id).then(record => {
    Object.assign(record, recordBody) // 对有提交的选项进行部分更新
    let historyRecord = new HistoryRecord(recordBody)
    historyRecord.order = record._id // 保存内部单号，对历史记录和当前记录进行关联
    historyRecord.status  = record.status // 更新最新的状态
    record.username = historyRecord.username = req.session.user.username // TODO 制单人为最新编辑的人
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
    record.hasTransport = true // 标记存在运输单
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