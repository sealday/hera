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

const router = express.Router();
const File = require('../models/File');

router.use(middleware.user);
router.post('/login', user.login);
router.post('/logout', user.logout);
router.get('/is_login', user.isLogin);

router.get('/article', article.list);

router.get('/file', file.list);
router.post('/file', upload.single('file'), file.post);

router.post('/purchase', purchase.postPurchase);

module.exports = router;