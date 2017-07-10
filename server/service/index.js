/**
 * Created by seal on 29/01/2017.
 */
const Payable = require('../models').Payable

exports.num = 0
exports.io = null
exports.sockets = []
exports.stock = {} // { ObjectId: { valid, inRecords, outRecords} }
exports.socketMap = new Map;

exports.root = null // 项目根路径，由 app 文件设置

exports.invalidStockCache = (stockId) => {
  if (exports.stock[stockId]) {
    exports.stock[stockId].valid = false
  }
}

exports.isValidStockCache = (stockId) => exports.stock[stockId] && exports.stock[stockId].valid

exports.refreshStockCache = (stockId, inRecords, outRecords) => {
  exports.stock[stockId] = {
    valid: true,
    inRecords,
    outRecords,
  }
}

exports.recordCreated = record => {
  if (record.type === '采购') {
    let payable = new Payable()
    payable.first = ''
    payable.second = '材料费'
    payable.vendor = record.vendor
    payable.sourceId = record._id
    payable.sourceType = '采购'
    payable.sum = 1000
    payable.save().catch(err => {
      console.log(err)
    })
  }
}

exports.transportUpdated = record => {
  if (record.transport.payer.indexOf('上海创兴建筑设备租赁有限公司') !== -1) {
    let payable = new Payable()
    payable.first = ''
    payable.second = '运费'
    payable.vendor = record.transport['carrier-name'] // 司机名称
    payable.sourceId = record._id
    payable.sourceType = '运输'
    payable.sum = Number(record.transport.weight) * Number(record.transport.price)
    if (isNaN(payable.sum)) {
      // 不是数字则没必要存到应付款项中
      return
    }
    payable.save().catch(err => {
      console.log(err)
    })
  }
}
