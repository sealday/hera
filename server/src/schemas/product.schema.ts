import * as mongoose from 'mongoose'

export const ProductSchema = new mongoose.Schema({
  type: String, // 类型
  number: Number, // 内部编号
  model: String, // 型号
  name: String, // 名称
  size: String, // 规格
  countUnit: String, // 计量单位
  weight: Number, // 理论重量
  unit: String, // 换算单位
  scale: Number, // 换算比例
  isScaled: Boolean, // 是否需要换算
  pinyin: String, // 产品名称的拼音
})

ProductSchema.index({ number: 1 }, { unique: true })