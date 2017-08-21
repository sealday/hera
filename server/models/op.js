const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *
 * 操作记录
 *
 */
const OpSchema = new Schema({
  base: String,
  text: String,
  tag: String,
  username: String,
  type: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('op', OpSchema);
