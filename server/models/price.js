const mongoose = require('mongoose');

const Schema = mongoose.Schema;
/**
 *
 * 运费考虑：
 *   - 出库运费
 *   - 入库运费
 *   - 按单运费调整
 *   - 出入库运费不一样（是否需要考虑？）
 */
const priceSchema = new Schema({
  name: String,
  date: Date,
  comments: String,
  entries: [{
    number: Number, // 规格编号
    unitPrice: Number, // 单价
    type: {
      type: String,
      enum: ['数量', '换算数量', '重量'],
    }, // 数量类型
    freight: Number, // 运费
    freightType: {
      type: String,
      enum: ['出库', '入库', '双向']
    }
  }]
});

module.exports = mongoose.model('Price', priceSchema)
