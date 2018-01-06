/**
 * Created by seal on 26/12/2016.
 */
const mongoose = require('mongoose');
const pinyin = require('pinyin')

const Schema = mongoose.Schema;
const productSchema = new Schema({
  type: String, // 类型
  number: String, // 内部编号
  model: String, // 型号
  name: String, // 名称
  size: String, // 规格
  countUnit: String, // 计量单位
  weight: Number, // 理论重量
  unit: String, // 换算单位
  scale: Number, // 换算比例
  isScaled: Boolean, // 是否需要换算

  pinyin: String, // 产品名称的拼音
});


productSchema.pre('save', function(next) {
  this.pinyin = pinyin(this.name, {
    style: pinyin.STYLE_NORMAL, heteronym: true
  }).map(array => array.join('')).join('')
  next()
})

productSchema.index({ number: 1 }, { unique: true })

module.exports = mongoose.model('Product', productSchema)
