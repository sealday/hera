/**
 * Created by seal on 30/12/2016.
 */

const express = require('express');

const Product = require('../models/Product');
const Tenant = require('../models/Tenant');
const Project = require('../models/Project');
const ProductType = require('../models/ProductType');
const Order = require('../models/Order');
const PurchaseOrder = require('../models/PurchaseOrder');

/**
 * 采购创建页面
 */
exports.create = (req, res) => {
  res.locals.info = req.query['info'] || '';
  res.locals.error = req.query['error'] || '';

  res.render('purchase/create', {
    title: '采购单填写',
    productTypes: global.companyData.productTypes
  });
};

/**
 * 保存采购信息
 */
exports.postPurchase = (req, res, next) => {
  let orderForm = {};
  const formKeys = ['project', 'date', 'entries', 'vendor'];
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

  let order = new PurchaseOrder();
  for (let k in orderForm) {
    order[k] = orderForm[k];
  }

  order.username = req.user.username;
  order.status = '未付款';

  order.save().then(() => {
    res.redirect('./purchase/create?info=保存成功！');
  }).catch(err => {
    next(err);
  });
};

exports.edit = (req, res, next) => {
  next('还未实现');
};

exports.postEdit = (req, res, next) => {
  next('还未实现');
};

exports.list = (req, res, next) => {
  PurchaseOrder.find()
    .then(purchaseOrders => {
      res.render('purchase/list', {
        purchaseOrders
      });
    });
};

exports.details = (req, res, next) => {
  next('还未实现');
};