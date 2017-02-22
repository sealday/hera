const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *
 * 计数器
 *
 */
const CounterSchema = new Schema({
    _id: String,
    seq: 0,
}, { timestamps: true });

module.exports = mongoose.model('Counter', CounterSchema);
