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

const Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;
