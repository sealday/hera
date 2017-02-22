/**
 * Created by seal on 26/12/2016.
 */
const mongoose = require('mongoose');
const pinyin = require('pinyin')

const Schema = mongoose.Schema;
const productSchema = new Schema({
  type: String,
  name: String,
  sizes: [String],
  unit: String,
  sizeUnit: String,
  countUnit: String,
  convert: Number, // 折合数量级
  convertUnit: String, // 折合单位

  pinyin: String, // 产品名称的拼音
});


productSchema.pre('save', function(next) {
  this.pinyin = pinyin(this.name, {
    style: pinyin.STYLE_NORMAL, heteronym: true
  }).map(array => array.join('')).join('')
  next()
})

module.exports = mongoose.model('Product', productSchema)
