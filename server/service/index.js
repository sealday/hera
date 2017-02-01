/**
 * Created by seal on 29/01/2017.
 */

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