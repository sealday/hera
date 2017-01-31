/**
 * Created by seal on 31/12/2016.
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
      $match: {
          outStock: ObjectId(outStock),
//          outDate: {
//              $gt: new Date('2017-01-14')
//          }
      },
    },
    {
      $unwind: '$entries'
    },
    {
      $project: {
        name: '$entries.name',
        size: '$entries.size',
        count: '$entries.count',
      }
    }
  ]);
}).then(results => {
  let end = new Date() - start;
  console.log(results);
  console.log('一共耗时 %d 毫秒', end);
}).catch(err => {
  console.log(err);
}).then(() => {
  mongoose.disconnect();
});

