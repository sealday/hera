/**
 * Created by seal on 31/12/2016.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *
 * 采购单
 *
 * TODO 采购单需不需要运输处理
 * TODO 需不需要一并处理销售单
 *
 */
const PurchaseOrderSchema = new Schema({
  stockRecord: {
    type: Schema.Types.ObjectId,
    ref: 'StockRecord'
  },

  project: Schema.Types.ObjectId, // 目标项目（为哪个项目采购的）

  vendor: String, // 卖家
  originalOrder: String, // 原始单号
  comments: String, // 订单说明内容
  status: String, // 采购单是否已经付款过

  valid: { type: Boolean, default: true }, // 是否有效

  date: Date, // 制单时间
  username: String, // 制单人

  entries: [{
    type: { // 类型
      type: String
    },
    name: String, // 名称
    size: String, // 规格
    count: Number, // 数量
    price: Number, // 单价
  }], // 订单项
}, { timestamps: true });

const PurchaseOrder = mongoose.model('PurchaseOrder', PurchaseOrderSchema);

module.exports = PurchaseOrder;
