const mongoose = require('mongoose')

const Schema = mongoose.Schema
const operationSchema = new Schema({
  level: String, // 操作等级
  type: String, // 操作类型
  timestamp: Number, // 时间戳
  report: Object, // 操作报告
  user: Object, // 操作用户
});

module.exports = mongoose.model('Operation', operationSchema)
