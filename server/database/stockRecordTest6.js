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
      $project: {
        name: '$entries.name',
        size: '$entries.size',
        count: '$entries.count',
      }
    },
    {
      $match: {
        name: {
//          $in: ['钢管', '方管', '工字钢', '槽钢']
          $in: ['轮扣']
        },
      }
    }
  ]);
}).then(results => {
  let end = new Date() - start;
  results.forEach(entry => {
    if (entry.size.length < 6) {
      console.log(entry.size.length)
    }
  })
  console.log('一共耗时 %d 毫秒', end);
}).catch(err => {
  console.log(err);
}).then(() => {
  mongoose.disconnect();
});

