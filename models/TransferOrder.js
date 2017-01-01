/**
 * Created by seal on 26/12/2016.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *
 * 调拨单（原发料归料单）
 *
 */
const TransferOrderSchema = new Schema({
  stockRecord: {
    type: Schema.Types.ObjectId,
    ref: 'StockRecord'
  },

  fromProject: Schema.Types.ObjectId, // 出发项目
  toProject: Schema.Types.ObjectId, // 到达项目

  comments: String, // 订单说明内容，对于调拨单，原始单号填写在备注中
  status: String, // 调拨单状态

  carNumber: String,
  carFee: Number,

  date: Date, // 制单时间
  username: String, // 制单人

  valid: { type: Boolean, default: true }, // 是否有效

  entries: [{
    type: { // 类型
      type: String
    },
    name: String, // 名称
    size: String, // 规格
    count: Number, // 数量
  }], // 订单项
}, { timestamps: true });

const TransferOrder = mongoose.model('TransferOrder', TransferOrderSchema);

module.exports = TransferOrder;
