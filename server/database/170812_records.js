/**
 * Created by seal on 08/12/2017
 *
 * 收款人去掉空格
 */

const mongoose = require('mongoose');
const Record = require('../models').Record;

mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost/hera')
  .then(()=> {
    return Record.find()
  }, e => {
    console.log(e)
  })
  .then((records) => {
    const filter_records = records.filter((record) => record.hasTransport)
    const result = []
    filter_records.forEach((record) => {
      record.transport.payee = (record.transport.payee || '').trim();
      result.push(record.save())
    })
    return Promise.all(result)
  }).then(() => {
    mongoose.disconnect()
  })
