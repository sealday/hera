const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *
 * 结转单
 *
 */
const CarrydownOrderSchema = new Schema({
  stockRecord: {
    type: Schema.Types.ObjectId,
    ref: 'StockRecord'
  },

  project: Schema.Types.ObjectId, // 目标项目（为哪个项目结转的）

  comments: String, // 订单说明内容

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

const CarrydownOrder = mongoose.model('CarrydownOrder', CarrydownOrderSchema);

module.exports = CarrydownOrder;
