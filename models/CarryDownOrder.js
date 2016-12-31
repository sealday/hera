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
const CarryDownOrderSchema = new Schema({
  stockRecord: {
    type: Schema.Types.ObjectId,
    ref: 'StockRecord'
  },

  project: Schema.Types.ObjectId, // 目标项目（为哪个项目结转的）

  comments: String, // 订单说明内容
  status: String, // 采购单是否已经付款过

  date: Date, // 制单时间
  username: String, // 制单人

  entries: [{
    type: { // 类型
      type: String
    },
    name: String, // 名称
    size: String, // 规格
    count: Number, // 数量
  }], // 订单项
}, { timestamps: true });

const CarryDownOrder = mongoose.model('CarryDownOrder', CarryDownOrderSchema);

module.exports = CarryDownOrder;
