/**
 * 测试计数器
 */

const mongoose = require('mongoose');
const Counter = require('../models/Counter');

mongoose.Promise = global.Promise;
const connection = mongoose.connect('mongodb://localhost/hera');

connection.then(() => {
  return Counter.findByIdAndUpdate('userid', { $inc: { seq: 1 } }, { new: true })
}).then(results => {
  console.log(results)
}).catch(err => {
  console.log(err);
}).then(() => {
  mongoose.disconnect();
});

