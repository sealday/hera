/**
 * Created by seal on 26/12/2016.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const projectSchema = new Schema({
  name: { type: String, unique: true },
  fullName: { type: String, unique: true},
  contacts: [{
    name: String,
    phone: String
  }],
  tel: String, // 公司电话
  address: String,
  comments: String,
  store: [{name: String, size: String, count: Number}],
  type: String,
}, { timestamps: true });

// 设置简称字段是索引
projectSchema.index({ name: 1 });

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

// 当规格表发生变化的时候，更新库存
// 因为数据不能丢失，所以规格表只能增加不能减少
// 界面上允许删除，但是需要用户自己判断没有相应的内容使用到对应的规格
projectSchema.methods.updateStore = function updateStore() {

};

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
