const express = require('express');
const router = express.Router();

const user = require('./user');
const project = require('./project');
const dashboard = require('./dashboard');
const control = require('./control');
const order = require('./order');
const purchase = require('./purchase');
const transfer = require('./transfer');
const orderRouter =  order.router;
const moment = require('moment');

router.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});

// 用户认证中间件
router.use(user.middleware);
// 正在管理项目设置中间件
router.use(project.middleware);

router.get('/', function(req, res, next) {
  if (req.user) {
    res.redirect('/project/' + req.session.current._id + '/');
    // 暂时不使用 dashboard
    // dashboard.index(req, res, next);
  } else {
    user.login(req, res);
  }
});

router.get('/login', user.login);
router.get('/logout', user.logout);
router.post('/login', user.postLogin);

router.post('/user', user.newUser);
router.post('/user/:id', user.updateUser);
router.post('/user/:id/delete', user.deleteUser);

// 处理 projectId 的中间件
router.use('/project/:projectId', project.middleware2);

router.get('/project/:projectId/order/create', order.create);
router.post('/project/:projectId/order', order.postOrder);
router.get('/project/:projectId/order/:id', order.details);

// 调入
router.use('/project/:projectId/transferIn', transfer.in);
router.get('/project/:projectId/transferIn/create', transfer.create);
router.get('/project/:projectId/transferIn/', transfer.list);
router.post('/project/:projectId/transferIn/', transfer.postPurchase);
router.use('/project/:projectId/transferIn/:id', transfer.middleware);
router.get('/project/:projectId/transferIn/:id/edit', transfer.edit);
router.get('/project/:projectId/transferIn/:id', transfer.details);
router.post('/project/:projectId/transferIn/:id', transfer.postEdit);

// 调出
router.use('/project/:projectId/transferOut', transfer.out);
router.get('/project/:projectId/transferOut/create', transfer.create);
router.get('/project/:projectId/transferOut/', transfer.list);
router.post('/project/:projectId/transferOut/', transfer.postPurchase);
router.use('/project/:projectId/transferOut/:id', transfer.middleware);
router.get('/project/:projectId/transferOut/:id/edit', transfer.edit);
router.get('/project/:projectId/transferOut/:id', transfer.details);
router.post('/project/:projectId/transferOut/:id', transfer.postEdit);

// 采购
router.get('/project/:projectId/purchase/create', purchase.create);
router.get('/project/:projectId/purchase/', purchase.list);
router.post('/project/:projectId/purchase/', purchase.postPurchase);
router.use('/project/:projectId/purchase/:id', purchase.middleware);
router.get('/project/:projectId/purchase/:id/edit', purchase.edit);
router.get('/project/:projectId/purchase/:id', purchase.details);
router.post('/project/:projectId/purchase/:id', purchase.postEdit);

router.use('/order', orderRouter);

// control 即管理中心
router.use('/control', control.middleware);
router.get('/control', control.index);

// 项目管理 API
router.get('/project/:id', project.index);
router.post('/project/:id', project.updateInfo);
router.post('/project', project.post);
router.post('/project/:id/delete', project.delete);

module.exports = router;
