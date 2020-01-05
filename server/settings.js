const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  name: String, // 单位名称（可为人名）
  bank: String, // 银行
  card: String, // 银行卡号
})

module.exports = mongoose.model('Vendor', vendorSchema)
