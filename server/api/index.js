/**
 * Created by seal on 10/01/2017.
 */
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/'});
const article = require('./article');
const file = require('./file');

const User = require('../models/User');
const middleware = require('./middleware');
const user = require('./user');
const project = require('./project');
const workercheckin = require('./worker')
const record = require('./record')
const payable = require('./payable')

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
router.post('/user/:id', user.update)

router.get('/article', article.list);
router.get('/project', project.list);
router.post('/project', project.create)
router.get('/project/:id', project.detail)
router.post('/project/:id', project.update)

router.post('/workercheckin',workercheckin.create)
router.post('/workercheckin/:id/edit',workercheckin.update);
router.get('/workercheckin',workercheckin.list);
router.post('/workercheckin/:id/delete',workercheckin.delete);
router.post('/workercheckin/:id/signin',workercheckin.signin)
router.post('/workercheckin/:id/signout',workercheckin.signout)



router.get('/payable_search',payable.paycheckSearch)


router.get('/record', record.list)
router.get('/record/:id', record.detail)
router.post('/record/:id', record.update)
router.post('/record/:id/transport', record.updateTransport)
router.post('/record', record.create)

router.get('/file', file.list);
router.post('/file', upload.single('file'), file.post);
router.get('/file/:filename', file.download)

router.get('/store/search', store.search)
router.get('/store/simple_search', store.simpleSearch)
router.get('/store/:id', store.queryAll)

module.exports = router;