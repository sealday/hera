const express = require('express');
const router = express.Router();

const user = require('./user');
const project = require('./project');
const dashboard = require('./dashboard');
const control = require('./control');
const order = require('./order');
const purchase = require('./purchase');
const orderRouter =  order.router;

// 用户认证中间件
router.use(user.middleware);

router.get('/', function(req, res, next) {
  if (req.user) {
    dashboard.index(req, res, next);
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


router.get('/project/:projectId/order/create', order.create);
router.post('/project/:projectId/order', order.postOrder);
router.get('/project/:projectId/order/:id', order.details);

router.get('/project/:projectId/purchase/create', purchase.purchaseCreate);
router.post('/project/:projectId/purchase', purchase.postPurchase);
router.use('/order', orderRouter);

// control 即管理中心
router.use('/control', control.middleware);
router.get('/control', control.index);

// 项目管理 API
router.post('/project/:id', project.updateInfo);
router.post('/project', project.post);
router.post('/project/:id/delete', project.delete);

module.exports = router;
