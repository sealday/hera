const mongoose = require('mongoose');

/**
 *
 * 重量方案：
 *   - 根据产品、规格定义重量
 */
const weightSchema = new mongoose.Schema({
  name: String,
  date: Date,
  comments: String,
  entries: [{
    type: {
      type: String, // 产品类型
    },
    name: String, // 产品名称
    size: String, // 产品规格
    unitWeight: Number, // 单位重量
    comments: String, // 备注
  }],
});

module.exports = mongoose.model('Weight', weightSchema)