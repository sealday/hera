/**
 * Created by seal on 30/12/2016.
 */

const Record = require('../models/Record').Record
const HistoryRecord = require('../models/Record').HistoryRecord

/**
 * 保存采购信息
 */
exports.postPurchase = (req, res, next) => {
  let record = new Record(req.body)
  let historyRecord = new HistoryRecord(req.body)

  record.type = historyRecord.type = '采购'
  record.order = historyRecord.order = record._id
  record.status = historyRecord.status = '未支付'

  Promise.all([record.save(), historyRecord.save()]).then(([record]) => {
    res.json({
      message: '创建采购单成功！',
      data: {
        record
      }
    })
  }).catch(err => {
    next(err)
  })
}
