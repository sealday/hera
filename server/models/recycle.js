const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 回收站
 */
const schema = new Schema({
  src: String, // 原始表名
  obj: Object, // 被删除的对象
  user: Object, // 执行删除的人
}, { timestamps: true });

module.exports = mongoose.model('Recycle', schema);
