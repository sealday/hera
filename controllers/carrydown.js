/**
 * Created by seal on 01/01/2017.
 */
const express = require('express');

const Product = require('../models/Product');
const Tenant = require('../models/Tenant');
const Project = require('../models/Project');
const ProductType = require('../models/ProductType');
const Order = require('../models/Order');
const CarrydownOrder = require('../models/CarrydownOrder');

/**
 * 结转创建页面
 */
exports.create = (req, res) => {
  res.locals.info = req.query['info'] || '';
  res.locals.error = req.query['error'] || '';

  res.render('carrydown/create', {
    title: '结转单填写',
    productTypes: global.companyData.productTypes
  });
};

/**
 * 保存结转信息
 */
exports.postPurchase = (req, res, next) => {
  let orderForm = {};
  const formKeys = ['project', 'date', 'entries'];
  formKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

  if (formKeys.some(key => !orderForm[key])) {
    return res.redirect(req.path + '/create' + '?error=信息填写不完整！');
  }

  const optionalFormKeys = ['comments'];
  optionalFormKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

  // 转换 entry 为数组
  if (!Array.isArray(orderForm.entries)) {
    orderForm.entries = [orderForm.entries];
  }
  orderForm.entries = orderForm.entries.map(entry => JSON.parse(entry));

  let order = new CarrydownOrder();
  for (let k in orderForm) {
    order[k] = orderForm[k];
  }

  order.username = req.user.username;

  order.save().then(() => {
    res.redirect('./carrydown/create?info=保存成功！');
  }).catch(err => {
    next(err);
  });
};

exports.list = (req, res, next) => {
  CarrydownOrder.find().where('valid', true)
    .then(carrydownOrders => {
      res.render('carrydown/list', {
        carrydownOrders
      });
    });
};

exports.middleware = (req, res, next) => {
  const id = req.params.id;
  CarrydownOrder.findById(id).then(carrydownOrder => {
    res.locals.carrydownOrder = carrydownOrder;
    next();
  }).catch(err => {
    next(err);
  });
};

exports.edit = (req, res, next) => {
  res.locals.info = req.query['info'] || '';
  res.locals.error = req.query['error'] || '';

  res.render('carrydown/edit', {
    productTypes: global.companyData.productTypes
  });
};

exports.postEdit = (req, res, next) => {
  let orderForm = {};
  const formKeys = ['project', 'date', 'entries'];
  formKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

  if (formKeys.some(key => !orderForm[key])) {
    return res.redirect('./edit?error=信息填写不完整！');
  }

  const optionalFormKeys = ['comments'];
  optionalFormKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

  // 转换 entry 为数组
  if (!Array.isArray(orderForm.entries)) {
    orderForm.entries = [orderForm.entries];
  }
  orderForm.entries = orderForm.entries.map(entry => JSON.parse(entry));

  let order = new CarrydownOrder();
  for (let k in orderForm) {
    order[k] = orderForm[k];
  }

  order.username = req.user.username;

  order.save().then(() => {
    return CarrydownOrder.findByIdAndUpdate(req.params.id, { valid: false });
  }).then(() => {
    res.redirect('./edit?info=更新成功！');
  }).catch(err => {
    next(err);
  });
};

exports.details = (req, res, next) => {
  res.render('carrydown/details');
};
