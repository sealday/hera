const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
  systemName: String, // 系统名称
  externalNames: [String], // 对外公司名称
  printSideComment: String, // 打印侧边说明
})

module.exports = mongoose.model('Setting', settingSchema)
