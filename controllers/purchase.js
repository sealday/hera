/**
 * Created by seal on 30/12/2016.
 */

const express = require('express');

const Product = require('../models/Product');
const Tenant = require('../models/Tenant');
const Project = require('../models/Project');
const ProductType = require('../models/ProductType');
const Order = require('../models/Order');

exports.purchaseCreate = (req, res, next) => {
  const id = req.params['projectId'];

  res.locals.info = req.query['info'] || '';
  res.locals.error = req.query['error'] || '';

  Promise.all([
    Tenant.find(),
    Project.find()
  ]).then(result => {
    let tenants = result[0].map(tenant => tenant.name);
    let currentProject = result[1].find(project => project.id == id);
    let projects = result[1].map(project => project.name);

    res.render('order/purchase', {
      title: '采购单填写',
      tenants,
      projects,
      currentProject,
      productTypes: companyData.productTypes
    });
  }).catch(err => {
    next(err);
  });
};

exports.postPurchase = (req, res, next) => {
  let orderForm = {};
  const formKeys = ['toProject', 'date', 'entry', 'vendor'];
  formKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

  if (formKeys.some(key => !orderForm[key])) {
    return res.redirect(req.path + '/create' + '?error=信息填写不完整！');
  }

  const optionalFormKeys = ['comments', 'carFee', 'carNumber'];
  optionalFormKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

  if (!Array.isArray(orderForm.entry)) {
    orderForm.entry = [orderForm.entry];
  }
  orderForm.entry = orderForm.entry.map(entry => JSON.parse(entry));

  let total = {};
  orderForm.entry.forEach(entry => {
    if (entry.name in total) {
      total[entry.name] += entry.total * 1;
    } else {
      total[entry.name] = entry.total * 1;
    }
  });

  let order = new Order();
  for (let k in orderForm) {
    order[k] = orderForm[k];
  }
  order.total = total;
  order.username = req.user.username;
  order.type = '采购';

  order.save().then(order => {
    orderForm.entry.forEach(entry => {
      entry.orderId = order._id;
    });
    return Product.create(orderForm.entry)
  }).then(() => {
    res.redirect('./purchase/create?info=保存成功！');
  }).catch(err => {
    next(err);
  });
};
