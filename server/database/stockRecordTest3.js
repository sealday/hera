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

connection.then(() => {
  let projectB = new Project();
  let order = new Order();

  let stockRecords = [];
  for (let i = 0; i < 1000; i++) {
    let stockRecord = new StockRecord();
    stockRecord.outStock = ObjectId('58673d42becccdd61d4074fe');
    stockRecord.inStock = projectB;
    stockRecord.inDate = new Date();
    stockRecord.outDate = new Date();
    stockRecord.original = order.id;
    stockRecord.originals.push(order.id);
    stockRecord.type = '调拨';

    for (let j = 0; j < 40; j++) {
      stockRecord.entries.push({
          name : '钢管',
          size : ((j + 10)/10).toFixed(1),
          count: (3000 * Math.random()).toFixed(0),
          type : '租赁品'
        });
    }

    stockRecords.push(stockRecord);
  }
  return StockRecord.create(stockRecords);
}).catch(err => {
  console.log(err);
}).then(() => {
  mongoose.disconnect();
});

