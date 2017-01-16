/**
 * Created by seal on 16/01/2017.
 */
const mongoose = require('mongoose');
const Record = require('../models/Record').Record
const HistoryRecord = require('../models/Record').HistoryRecord
const TransferOrder = require('../models/TransferOrder')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/hera').then(() => {
  return TransferOrder.find({valid: true})
}).then(orders => {
  let records = []
  let historyRecords = []

  console.log(orders[0])

  orders.forEach(order => {
    let record = new Record()
    let historyRecord = new HistoryRecord()


    record.comments = historyRecord.comments = order.comments
    record.carNumber = historyRecord.carNumber = order.carNumber
    record.status = historyRecord.status = order.status
    record.entries = historyRecord.entries = order.entries
    record.username = historyRecord.username = order.username
    record.type = historyRecord.type = "调拨"

    if (order.hasTransport) {
      record.hasTransport = historyRecord.hasTransport = order.hasTransport
      record.transport = historyRecord.transport = order.transport
    }

    historyRecord.order = record.order = record._id
    record.inStock =  historyRecord.inStock = order.toProject // 到达的地方 进去的地方
    record.outStock = historyRecord.outStoc = order.fromProject // 出发  出来的地方
    record.fee = historyRecord.fee = {}
    // 假设有这个的话
    if (order.carFee) {
      record.fee.car = order.carFee
      historyRecord.fee.car = order.carFee
    }

    // 假设用了新的费用模型
    if (order.cost) {
      record.fee = order.cost
      historyRecord.fee = order.cost
    }
    records.push(record)
    historyRecords.push(historyRecord)
  })
  return Promise.all([Record.create(records), HistoryRecord.create(historyRecords)])
}).catch(err => {
  console.log(err)
}).then(() => {
  mongoose.disconnect();
});
