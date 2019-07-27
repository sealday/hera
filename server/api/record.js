const pinyin = require('pinyin')
const _ = require('lodash')

const Record = require('../models').Record
const HistoryRecord = require('../models').HistoryRecord
const service = require('../service')
const logger = service.logger
const helper = require('../utils/my').helper


const list = async (req, res) => {
  const records = await Record.find(req.query)
  res.json({
    data: {
      records
    }
  })
}

/*
客户端传来 inStock 和 outStock，这里不判断是调入还是调出
 */
const create = async (req, res) => {
  const body = _.omit(req.body, ['_id'])
  let record = new Record(body)
  let historyRecord = new HistoryRecord(body)
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
  const [savedRecord] = await Promise.all([record.save(), historyRecord.save()])
  service.recordCreated(savedRecord) // 处理订单创建后置事件
  logger.logNewRecord(savedRecord, req.session.user)
  res.json({
    message: '创建' + savedRecord.type + '单成功！',
    data: {
      record: savedRecord,
    }
  })
}

const detail = async (req, res) => {
  const record = await Record.findById(req.params.id)
  res.json({
    data: {
      record
    }
  })
}

const update = async (req, res) => {
  // 忽略 _id 否则正在创建历史记录时会出问题（允许客户端提交 _id 但是进行忽略)
  let recordBody = _.omit(req.body, ['_id'])
  if (!req.params.id) {
    return res.status(400).json({
      message: '请求参数有误！'
    })
  }
  const record = await Record.findById(req.params.id)
  const lhs = record.toObject();
  Object.assign(record, recordBody) // 对有提交的选项进行部分更新
  let historyRecord = new HistoryRecord(recordBody)
  historyRecord.order = record._id // 保存内部单号，对历史记录和当前记录进行关联
  historyRecord.status  = record.status // 更新最新的状态
  record.username = historyRecord.username = req.session.user.username // TODO 制单人为最新编辑的人
  const [updatedRecord] = await Promise.all([record.save(), historyRecord.save()])
  const rhs = record.toObject()
  logger.logRecordDiff(lhs, rhs, req.session.user)
  res.json({
    message: '更新' + updatedRecord.type +'成功！',
    data: {
      record: updatedRecord,
    }
  })
}

const updateTransport = async (req, res) => {
  const record = await Record.findById(req.params.id)
  Object.assign(record.transport, req.body)
  record.hasTransport = true // 标记存在运输单
  const updatedRecord = await record.save()
  service.transportUpdated(updatedRecord) // 处理运输单更新后置事件
  res.json({
    message: '保存运输单成功',
    data: {
      record: updatedRecord,
    }
  })
}

const findAllPayer = async (req, res) => {
  const result = await Record.distinct('transport.payer', { 'transport.payer': { $ne: '' } })
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
}

const updateTransportPaidStatus = async (req, res) => {
  if (typeof req.body['paid'] === 'undefined') {
    return res.status(400).send('参数不正确！')
  }
  const id = req.params.id
  const paid = req.body['paid'] || false
  await Record.findOneAndUpdate({ _id: id }, { $set: { transportPaid: paid } })
  res.json({
    message: '修改运输付费状态成功',
    data: {
      transportPaid: paid
    }
  })
}

const updateTransportCheckedStatus = async (req, res) => {
  if (typeof req.body['checked'] === 'undefined') {
    return res.status(400).send('参数不正确！')
  }
  const id = req.params.id
  const paid = req.body['checked'] || false
  await Record.findOneAndUpdate({ _id: id }, { $set: { transportChecked: paid } })
  res.json({
    message: '修改运输核对状态成功',
    data: {
      transportChecked: paid
    }
  })
}

exports.list = helper(list)
exports.create = helper(create)
exports.detail = helper(detail)
exports.update = helper(update)
exports.updateTransport = helper(updateTransport)
exports.findAllPayer = helper(findAllPayer)
exports.updateTransportPaidStatus = helper(updateTransportPaidStatus)
exports.updateTransportCheckedStatus = helper(updateTransportCheckedStatus)
