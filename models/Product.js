const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new Schema({
  type: String,
  name: String,
  size: String, // 规格
  count: Number, // 数量
  price: Number, // 单价
  total: Number, // 小计
  totalPrice: Number, // 价格
  orderId: ObjectId,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
