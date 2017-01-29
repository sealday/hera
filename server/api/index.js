/**
 * Created by seal on 10/01/2017.
 */
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/'});
const article = require('./article');
const file = require('./file');
const purchase = require('./purchase');

const User = require('../models/User');
const middleware = require('./middleware');
const user = require('./user');
const project = require('./project');
const transfer = require('./transfer')

const router = express.Router();
const File = require('../models/File');

const store = require('./store')

router.use(middleware.user);
router.post('/login', user.login);
router.post('/logout', user.logout);
router.get('/is_login', user.isLogin);
router.get('/load', user.load);

router.get('/user', user.list)
router.post('/user', user.create)
router.post('/user_update', user.update)

router.get('/article', article.list);
router.get('/project', project.list);
router.post('/project', project.create)
router.get('/project/:id', project.detail)
router.post('/project/:id', project.update)

router.get('/transfer', transfer.list)
router.get('/transfer/:id', transfer.detail)
router.post('/transfer/:id', transfer.update)
router.post('/transfer/:id/transport', transfer.updateTransport)
router.post('/transfer', transfer.create)

router.get('/file', file.list);
router.post('/file', upload.single('file'), file.post);

router.get('/store/:id', store.queryAll)

router.post('/purchase', purchase.postPurchase);

module.exports = router;