/**
 * Created by xin on 2017/2/19.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PayableSchema = new Schema({

  number: Number, // 流水号
  vendor: String, // 对方单位
  sourceId: Schema.Types.ObjectId, // 由什么生成
  sourceType: String, // 采购、运输
  first: String, // 一级科目
  second: String, // 二级科目
  sum: Number // 金额

}, { timestamps: true }); // 时间戳中有制单时间

const Payable = mongoose.model('Payable', PayableSchema);

module.exports = Payable;

