/**
 * Created by seal on 26/12/2016.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const productTypeSchema = new Schema({
  type: String,
  name: String,
  sizeMap: {
    size: '', // 规格
    count: '', // 这个规格如何影响小计（也就是计算）
  }
});

const ProductType = mongoose.model('ProductType', productTypeSchema);

module.exports = ProductType;
