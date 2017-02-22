/**
 * 测试计数器
 */

const mongoose = require('mongoose');
const Record = require('../models').Record;
const Counter = require('../models').Counter
const ObjectId = mongoose.Types.ObjectId;

mongoose.Promise = global.Promise;
const connection = mongoose.connect('mongodb://localhost/hera');

connection.then(() => {
  return Record.find()
}).then(records => {
  let saves = []
  records.forEach((record, index) => {
    record.number = index + 1
    record.entries.forEach(entry => {
      if (String(entry._id).length < 24) {
        entry._id = ObjectId()
      }
    })
    saves.push(record.save())
  })
  return Promise.all(saves)
}).then(results => {
  console.log('更新订单编号成功！')
}).catch(err => {
  console.log(err);
}).then(() => {
  mongoose.disconnect();
  console.log(ObjectId())
});

