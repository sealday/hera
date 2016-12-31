/**
 * Created by seal on 31/12/2016.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * TODO 日期问题需要注意一下
 */
const StockRecordSchema = new Schema({
  outStock: Schema.Types.ObjectId, // 出库仓库
  inStock: Schema.Types.ObjectId, // 入库仓库
  entries: [{
    type: { // 类型
      type: String
    },
    name: String, // 名称
    size: String, // 规格
    count: Number, // 数量
  }], // 订单项
  valid: Boolean, // 是否是有效的库存信息
  outDate: Date, // 出库时间
  inDate: Date, // 入库时间
  original: Schema.Types.ObjectId, // 最新原始单据
  originals: [Schema.Types.ObjectId], // 原始单据，保存单据历史记录
  type: String,  // 采购、调拨、销售、报废、结转
}, { timestamps: true });

// TODO 建立合适的索引让检索更快一些
//StockRecordSchema.index({ inStock: 1 });
//StockRecordSchema.index({ outStock: 1 });

const StockRecord = mongoose.model('StockRecord', StockRecordSchema);

module.exports = StockRecord;
