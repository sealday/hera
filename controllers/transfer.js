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

/**
 * 保存调入调出信息
 */
exports.postPurchase = (req, res, next) => {
  const direction = req.direction;
  const current = res.locals.current;
  let orderForm = {};
  const formKeys = ['project', 'date', 'entries'];
  formKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

  if (formKeys.some(key => !orderForm[key])) {
    return res.redirect(req.path + '/create' + '?error=信息填写不完整！');
  }

  const optionalFormKeys = ['comments', 'carFee', 'carNumber', 'originalOrder'];
  optionalFormKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

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

  order.save().then(() => {
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
  const formKeys = ['project', 'date', 'entries'];
  formKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

  if (formKeys.some(key => !orderForm[key])) {
    return res.redirect('./edit?error=信息填写不完整！');
  }

  const optionalFormKeys = ['comments', 'carFee', 'carNumber', 'originalOrder'];
  optionalFormKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

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

  order.save().then(() => {
    return TransferOrder.findByIdAndUpdate(req.params.id, { valid: false });
  }).then(() => {
    res.redirect('./edit?info=更新成功！');
  }).catch(err => {
    next(err);
  });
};

exports.details = (req, res, next) => {
  const direction = req.direction;
  res.render('transfer/details', {
    direction
  });
};
