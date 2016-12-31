/**
 * Created by seal on 31/12/2016.
 */

const mongoose = require('mongoose');
const StockRecord = require('../models/StockRecord');
const Project = require('../models/Project');
const Order = require('../models/Order');
const ObjectId = mongoose.Types.ObjectId;

mongoose.Promise = global.Promise;
const connection = mongoose.connect('mongodb://localhost/hera');

//const StockRecordSchema = new Schema({
//  outStock: ObjectId, // 出库仓库
//  inStock: ObjectId, // 入库仓库
//  entries: [{type: String, name: String, size: String, count: Number}], // 订单项
//  outDate: Date, // 出库时间
//  inDate: Date, // 入库时间
//  original: ObjectId, // 最新原始单据
//  originals: [ObjectId], // 原始单据，保存单据历史记录
//  type: String,  // 采购、调拨、销售、报废
//}, { timestamps: true });

let start = null;
connection.then(() => {
  let outStock = '58673d42becccdd61d4074fe';

  start = new Date();

  return StockRecord.aggregate([
    {
      $match: {outStock: ObjectId(outStock)},
    },
    {
      $unwind: '$entries'
    },
    {
      $group: {
        _id: {
          name: '$entries.name',
          size: '$entries.size'
        },
        sum_of_it: {
          $sum: '$entries.count'
        }
      }
    }
  ]);

  //return StockRecordk.mapReduce({
  //  map: function() {
  //    emit(this.)
  //  },
  //  reduce: function() {
  //
  //  }
  //}).then(results => {
  //
  //});

}).then(results => {
  let end = new Date() - start;
  console.log(results);
  console.log('一共耗时 %d 毫秒', end);
}).catch(err => {
  console.log(err);
}).then(() => {
  mongoose.disconnect();
});

