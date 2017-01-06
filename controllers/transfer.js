/**
 * Created by seal on 01/01/2017.
 */
const express = require('express');

const Product = require('../models/Product');
const Tenant = require('../models/Tenant');
const Project = require('../models/Project');
const ProductType = require('../models/ProductType');
const Order = require('../models/Order');
const TransferOrder = require('../models/TransferOrder');
const mongoose = require('mongoose');
const my = require('../utils/my');
const StockRecord = require('../models/StockRecord');


exports.in = (req, res, next) => {
  req.direction = 'in';
  next();
};

exports.out = (req, res, next) => {
  req.direction = 'out';
  next();
};

/**
 * 调出调入单填写界面
 */

exports.create = (req, res, next) => {
  res.locals.info = req.query['info'] || '';
  res.locals.error = req.query['error'] || '';

  if (req.direction == 'in') {
    res.render('transfer/create', {
      title: '调入单填写',
      direction: 'in',
      productTypes: global.companyData.productTypes
    });
  } else if (req.direction == 'out') {
    res.render('transfer/create', {
      title: '调出单填写',
      direction: 'out',
      productTypes: global.companyData.productTypes
    });
  }
};

const formKeys = ['project', 'date', 'entries'];
const optionalFormKeys = ['comments', 'carFee', 'carNumber', 'originalOrder'];

/**
 * 保存调入调出信息
 */
exports.postPurchase = (req, res, next) => {
  const direction = req.direction;
  const current = res.locals.current;
  let orderForm = {};
  formKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

  if (formKeys.some(key => !orderForm[key])) {
    return res.redirect(req.path + '/create' + '?error=信息填写不完整！');
  }

  optionalFormKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

  console.log(req.body);
  orderForm.cost = {
    car: req.body['cost.car'] || '',
    sort: req.body['cost.sort'] || '',
    other1: req.body['cost.other1'] || '',
    other2: req.body['cost.other2'] || ''
  };

  // 转换 entry 为数组
  if (!Array.isArray(orderForm.entries)) {
    orderForm.entries = [orderForm.entries];
  }
  orderForm.entries = orderForm.entries.map(entry => JSON.parse(entry));

  let order = new TransferOrder();
  for (let k in orderForm) {
    order[k] = orderForm[k];
  }

  if (direction == 'in') {
    order.toProject = current._id;
    order.fromProject = order.project;
  } else if (direction == 'out') {
    order.toProject = order.project;
    order.fromProject = current._id;
  }

  order.username = req.user.username;
  order.status = '未确认';

  let stockRecord = new StockRecord();
  stockRecord.inStock = order.toProject;
  stockRecord.outStock = order.fromProject;
  stockRecord.inDate = order.date;
  stockRecord.outDate = order.date;
  stockRecord.entries = order.entries;
  stockRecord.original = order._id;
  stockRecord.originals.push(order._id);
  stockRecord.type = '调拨';

  order.stockRecord = stockRecord._id;

  Promise.all([stockRecord.save(), order.save()]).then(() => {
    if (direction == 'in') {
      res.redirect('./transferIn/create?info=保存成功！');
    } else if (direction == 'out') {
      res.redirect('./transferOut/create?info=保存成功！');
    }
  }).catch(err => {
    next(err);
  });
};

exports.list = (req, res, next) => {
  const current = res.locals.current;
  const direction = req.direction;

  let validQuery = TransferOrder.find().where('valid', true);
  if (direction == 'in') {
    validQuery.where('toProject', current._id);
  } else if (direction == 'out') {
    validQuery.where('fromProject', current._id);
  }

  validQuery.then(transferOrders => {
    res.render('transfer/list', {
      transferOrders,
      direction
    });
  });
};

exports.middleware = (req, res, next) => {
  const id = req.params.id;
  TransferOrder.findById(id).then(transferOrder => {
    res.locals.transferOrder = transferOrder;
    next();
  }).catch(err => {
    next(err);
  });
};

exports.edit = (req, res, next) => {
  const direction = req.direction;
  res.locals.info = req.query['info'] || '';
  res.locals.error = req.query['error'] || '';

  res.render('transfer/edit', {
    productTypes: global.companyData.productTypes,
    direction
  });
};

exports.postEdit = (req, res, next) => {
  const direction = req.direction;
  const current = res.locals.current;
  let orderForm = {};
  formKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

  if (formKeys.some(key => !orderForm[key])) {
    return res.redirect('./edit?error=信息填写不完整！');
  }

  optionalFormKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

  orderForm.cost = {
    car: req.body['cost.car'] || '',
    sort: req.body['cost.sort'] || '',
    other1: req.body['cost.other1'] || '',
    other2: req.body['cost.other2'] || ''
  };

  // 转换 entry 为数组
  if (!Array.isArray(orderForm.entries)) {
    orderForm.entries = [orderForm.entries];
  }
  orderForm.entries = orderForm.entries.map(entry => JSON.parse(entry));

  let order = new TransferOrder();
  for (let k in orderForm) {
    order[k] = orderForm[k];
  }

  if (direction == 'in') {
    order.toProject = current._id;
    order.fromProject = order.project;
  } else if (direction == 'out') {
    order.toProject = order.project;
    order.fromProject = current._id;
  }

  order.username = req.user.username;
  order.status = res.locals.transferOrder.status;

  TransferOrder.findById(req.params.id).then(transferOrder => {
    transferOrder.valid = false;
    const stockRecordId = transferOrder.stockRecord;
    return Promise.all([transferOrder.save(),
      StockRecord.findById(stockRecordId)]);
  }).then(result => {
    let stockRecord = result[1];
    stockRecord.inStock = order.toProject;
    stockRecord.outStock = order.fromProject;
    stockRecord.inDate = order.date;
    stockRecord.outDate = order.date;
    stockRecord.entries = order.entries;
    stockRecord.original = order._id;
    stockRecord.originals.push(order._id);
    stockRecord.type = '调拨';

    order.stockRecord = stockRecord._id;
    return Promise.all([order.save(), stockRecord.save()]);
  }).then(() => {
    res.redirect('./edit?info=更新成功！');
  }).catch(err => {
    next(err);
  });
};


exports.details = (req, res, next) => {
  const direction = req.direction;
  let transferOrder = res.locals.transferOrder;
  let entries = { };
  let total = {};

  transferOrder.entries.forEach(entry => {
    let result = entry.count * my.calculateSize(entry.size);

    if (entry.name in entries) {
      total[entry.name] += result;
      entries[entry.name].push(entry);
    } else {
      entries[entry.name] = [entry];
      total[entry.name] = result;
    }
  });

  const productTypeMap = global.companyData.productTypeMap;
  let printEntries = [];
  for (let name in entries) {
    entries[name].forEach(entry => {
      printEntries.push({
        name: entry.name,
        size: entry.size.split(';').join(' ') + ' ' + productTypeMap[name].sizeUnit,
        count: entry.count + ' ' + productTypeMap[name].countUnit
      });
    });
    printEntries.push({
      name: name,
      size: '小计',
      count: toFixedWithoutTrailingZero(total[name])  + ' ' + productTypeMap[name].unit
    });
  }

  printEntries.push({
    name: '运费：￥' + (transferOrder.cost.car || 0),
    size: '整理费：￥' + (transferOrder.cost.sort || 0),
    count: `其他费用1：￥${transferOrder.cost.other1 || 0} 其他费用2：￥${transferOrder.cost.other2 || 0}`
  });

  let columnLength = Math.ceil(printEntries.length / 2);
  res.render('transfer/details', {
    direction,
    entries,
    total,
    printEntries,
    columnLength
  });
};


// 保留两位数，去除多余的零
function toFixedWithoutTrailingZero(num) {
  return Number(num.toFixed(2)).toString();
}