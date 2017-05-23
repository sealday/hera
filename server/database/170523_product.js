/**
 * Created by seal on 05/23/2017
 *
 * 将 '顶丝' 替换成 '轮扣顶丝'
 */

const mongoose = require('mongoose');
const Record = require('../models').Record;

mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost/hera')
  .then(()=> {
    return Record.find()
  }, e => {
    console.log(e);
  })
  .then((records) => {
    const filter_records = records.filter((record) => record.entries.some((entry) => entry.name === '顶丝'))
    const result = [];
    filter_records.forEach((record) => {
      record.entries.forEach((entry) => {
        if (entry.name === '顶丝') {
          entry.name = '轮扣顶丝';
        }
      });
      result.push(record.save());
    });
    return Promise.all(result);
  }).then(() => {
     mongoose.disconnect();
  });
