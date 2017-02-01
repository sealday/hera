/**
 * Created by seal on 31/12/2016.
 * 找出所有的订单中，架子类型错误的
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
        'entries.size': {
          $in: ['钢管架', '扣件托盘', '轮扣立杆架', '轮扣横杆架']
        },
        'entries.type': '租赁类'
      },
    },
    {
      $project: {
        // 默认包含了id
        outStock: '$outStock',
        inStock: '$inStock',
        outDate: '$outDate',
        type: '$entries.type',
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

