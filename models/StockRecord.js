/**
 * Created by seal on 31/12/2016.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;
const ObjectId = Schema.Types.ObjectId;

/**
 * TODO 日期问题需要注意一下
 */
const StockRecordSchema = new Schema({
  outStock: ObjectId, // 出库仓库
  inStock: ObjectId, // 入库仓库
  entries: [{
    type: {
      type: String
    },
    name: String,
    size: String,
    count: Number,
  }], // 订单项
  outDate: Date, // 出库时间
  inDate: Date, // 入库时间
  original: ObjectId, // 最新原始单据
  originals: [ObjectId], // 原始单据，保存单据历史记录
  type: String,  // 采购、调拨、销售、报废
}, { timestamps: true });

// TODO 建立合适的索引让检索更快一些
//StockRecordSchema.index({ inStock: 1 });
//StockRecordSchema.index({ outStock: 1 });

const StockRecord = mongoose.model('StockRecord', StockRecordSchema);

module.exports = StockRecord;
