const mongoose = require('mongoose')
const Schema = mongoose.Schema
const pinyin = require('pinyin')
const projectSchema = new Schema({
  name: String, // 项目名称
  company: String, // 公司名称
  abbr: String,  // 项目简称
  completeName: String, // 全称
  pinyin: String, // 公司名称加项目简称的拼音
  contacts: [{
    name: String, // 联系人姓名
    phone: String, // 联系人电话
    number: String, // 身份证号
  }],
  banks: [{
    name: String, // 账户名称
    bank: String, // 开户行
    account: String, // 账号
  }],
  tel: String, // 项目部电话
  companyTel: String, // 单位电话
  address: String, // 项目部地址
  comments: String, // 备注
  store: [{name: String, size: String, count: Number}], // 库存信息（实时）
  type: String, // 仓库类型
  items: [{
    name: String, // 名称
    startDate: Date, // 开始时间
    endDate: Date, // 结束时间
    createdAt: Date, // 创建时间
    updatedAt: Date, // 更新时间
    username: String, // 操作员
    planId: Schema.Types.ObjectId, // 价格方案
    taxRate: { type: String, default: "0.03" }, // 税率
    content: Schema.Types.Mixed, // 内容
  }],
  status: { type: String, default: 'UNDERWAY' }, // 已完结 UNDERWAY/FINISHED
  base: String, // 关联的基地仓库，用来制作三方的库存记录
}, { timestamps: true })

// 设置简称字段是索引
projectSchema.index({ completeName: 1 }, { unique: true })

projectSchema.pre('save', function save(next) {
  const project = this
  project.completeName = project.name + project.company
  next()
})

projectSchema.pre('save', function(next) {
  this.pinyin = pinyin(this.company + this.name, {
    style: pinyin.STYLE_NORMAL, heteronym: true
  }).map(array => array.join('')).join('')
  next()
})

module.exports = mongoose.model('Project', projectSchema)
