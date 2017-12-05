/**
 * Created by seal on 15/01/2017.
 */

const Record = require('../models').Record
const HistoryRecord = require('../models').HistoryRecord
const service = require('../service')
const pinyin = require('pinyin')
const logger = service.logger


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
    case '销售':
      record.status = historyRecord.status = '未支付'
      break
    case '调拨':
      record.status = historyRecord.status = '未确认'
      break
    case '盘点入库':
    case '盘点出库':
      // 没有状态信息
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

    service.recordCreated(record) // 处理订单创建后置事件

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
    const lhs = record.toObject();
    Object.assign(record, recordBody) // 对有提交的选项进行部分更新
    let historyRecord = new HistoryRecord(recordBody)
    historyRecord.order = record._id // 保存内部单号，对历史记录和当前记录进行关联
    historyRecord.status  = record.status // 更新最新的状态
    record.username = historyRecord.username = req.session.user.username // TODO 制单人为最新编辑的人
    return Promise.all([record.save(), historyRecord.save(), lhs])
  }).then(([record, _, lhs]) => {
    const rhs = record.toObject()
    logger.logRecordDiff(lhs, rhs, req.session.user)
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

    service.transportUpdated(record) // 处理运输单更新后置事件

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

exports.findAllPayer = (req, res, next) => {
  Record.distinct('transport.payer', { 'transport.payer': { $ne: '' } }).then((result) => {
    const payers = result.map((payer) => ({
      name: payer,
      pinyin: pinyin(payer, {
        style: pinyin.STYLE_NORMAL,
        heteronym: true
      }).map(array => array.join('')).join(''),
    }))
    res.json({
      message: '获取所有付款人成功',
      data: {
        payers
      }
    })
  }).catch((err) => {
    next(err)
  })
}

exports.updateTransportPaidStatus = (req, res, next) => {
  if (typeof req.body['paid'] === 'undefined') {
    return res.status(400).send('参数不正确！')
  }
  const id = req.params.id
  const paid = req.body['paid'] || false
  Record.findOneAndUpdate({ _id: id }, { $set: { transportPaid: paid } }).then(() => {
    res.json({
      message: '修改运输付费状态成功',
      data: {
        transportPaid: paid
      }
    })
  }).catch((err) => {
    next(err)
  })
}

exports.updateTransportCheckedStatus = (req, res, next) => {
  if (typeof req.body['checked'] === 'undefined') {
    return res.status(400).send('参数不正确！')
  }
  const id = req.params.id
  const paid = req.body['checked'] || false
  Record.findOneAndUpdate({ _id: id }, { $set: { transportChecked: paid } }).then(() => {
    res.json({
      message: '修改运输核对状态成功',
      data: {
        transportChecked: paid
      }
    })
  }).catch((err) => {
    next(err)
  })
}
