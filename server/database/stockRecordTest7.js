/**
 * Created by seal on 31/12/2016.
 * 找出所有的订单中，规格错误的
 * 即6.0写成6的
 */

const mongoose = require('mongoose');
const Record = require('../models/Record').Record;
const Project = require('../models/Project');
const Order = require('../models/Order');
const ObjectId = mongoose.Types.ObjectId;

mongoose.Promise = global.Promise;
const connection = mongoose.connect('mongodb://localhost/hera');

let start = null;
connection.then(() => {
  let outStock = '586df7fe2d256304867ab346';

  start = new Date();

  return Record.aggregate([
    {
      $unwind: '$entries'
    },
    {
      $match: {
        'entries.name': '钢管',
        'entries.size': '4.2'
      },
    },
    {
      $project: {
        // 默认包含了id
        outStock: '$outStock',
        inStock: '$inStock',
        outDate: '$outDate',
        name: '$entries.name',
        size: '$entries.size',
        count: '$entries.count',
        number: '$number',
        type: '$type'
        //recordId: '$recordId'
      }
    }
  ])
}).then(results => {
  let end = new Date() - start;
  console.log(results)
  console.log(results.length)
  console.log('一共耗时 %d 毫秒', end);
}).catch(err => {
  console.log(err);
}).then(() => {
  mongoose.disconnect();
});

