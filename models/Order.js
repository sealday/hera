/**
 * Created by seal on 26/12/2016.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

/**
 * 发料和归料是对数据的一种看的角度
 *
 * 对于订单，要忠实于这个订单的三个事情
 * 1 订单的状态，订单是否确认，是否无效
 * 2 订单是否有属于的合同
 * 3 订单保存了仓库的记录（订单相当于仓库的流水）
 */
const orderSchema = new Schema({
  tenant: String, // 合同的项目
  date: Date, // TODO 日期需要注意一下会不会出问题
  fromProject: String,
  toProject: String,
  comments: String, // 订单说明的内容
  status: String, // 未确认的也暂时记录到库存变化中
  fromCurrent: Array,
  toCurrent: Array,
  total: Mixed,
  carNumber: String,
  carFee: Number,
  username: String,
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
