/**
 * Created by seal on 29/01/2017.
 */
const Payables = require('../api/payables')
exports.num = 0
exports.io = null
exports.sockets = []
exports.stock = {} // { ObjectId: { valid, inRecords, outRecords} }

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

exports.handleRecordCreate = (record)=>
{
  switch (record.type){
    case '采购':
      Payables.create(record)
      break;
    case '销售':
      break
    case '调拨':
      break
    case '盘点入库':
      break
    case '盘点出库':
      break
  }
}

exports.handleTransportUpdated = (record)=>{
  if(record.hasTransport){
    if(record.transport.payer.includes('上海创兴建筑设备租赁有限公司')){
      Payables.createTransport(record)
    }
  }
}
