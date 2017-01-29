/**
 * Created by seal on 29/01/2017.
 */

exports.num = 0
exports.io = null
exports.sockets = []
exports.stock = {} // { ObjectId: { valid, inRecords, outRecords} }

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