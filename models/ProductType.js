/**
 * Created by seal on 26/12/2016.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const productTypeSchema = new Schema({
  type: String,
  name: String,
  sizes: [String],
  unit: String,
  sizeUnit: String,
  countUnit: String,
  convert: Number, // 折合数量级
  convertUnit: String // 折合单位
});


const ProductType = mongoose.model('ProductType', productTypeSchema);

module.exports = ProductType;
