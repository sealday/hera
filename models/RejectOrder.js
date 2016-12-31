/**
 * Created by seal on 31/12/2016.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *
 * 报废单
 * TODO 报废单要进入怎么样的管理呢？
 *
 */
const PurchaseOrderSchema = new Schema({
  stockRecord: {
    type: Schema.Types.ObjectId,
    ref: 'StockRecord'
  },

  project: String, // 哪个项目报废的物品 TODO 只有基地仓库有填写报废的需要？

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

const PurchaseOrder = mongoose.model('PurchaseOrder', PurchaseOrderSchema);

module.exports = PurchaseOrder;
