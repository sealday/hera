/**
 * Created by seal on 26/12/2016.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pinyin = require('pinyin')

const projectSchema = new Schema({
  name: String, // 项目名称
  company: String, // 公司名称
  abbr: String,  // 项目简称
  completeName: String, // 全称
  pinyin: String, // 公司名称加项目简称的拼音
  contacts: [{
    name: String, // 联系人姓名
    phone: String // 联系人电话
  }],
  tel: String, // 项目部电话
  companyTel: String, // 单位电话
  address: String, // 项目部地址
  comments: String, // 备注
  store: [{name: String, size: String, count: Number}], // 库存信息（实时）
  type: String, // 仓库类型

  base: String, // 关联的基地仓库，用来制作三方的库存记录
}, { timestamps: true });

// 设置简称字段是索引
projectSchema.index({ completeName: 1 }, { unique: true });

projectSchema.pre('save', function save(next) {
  const project = this;
  project.completeName = project.name + project.company;
  next();
});

/**
 * 使用规格表的数据来进行初始化
 */
projectSchema.methods.initStore = function initStore() {
  const project = this;
  const productTypes = global.companyData.productTypes;
  productTypes.forEach(productType => {
    productType.sizes.forEach(size => {
      project.store.push({
        name: productType.name,
        size,
        count: 0
      });
    });
  });
};

projectSchema.pre('save', function(next) {
  this.pinyin = pinyin(this.company + this.name,
    {style: pinyin.STYLE_NORMAL, heteronym: true}).map(array => array.join('')).join('')
  next()
})

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
