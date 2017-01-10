/**
 * Created by seal on 10/01/2017.
 */
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/'});
const article = require('./article');
const file = require('./file');

const router = express.Router();
const File = require('../../models/File');

router.get('/article', article.list);

router.get('/file', file.list);
router.post('/file', upload.single('file'), file.post);

// 错误结果用 json 的形式返回
router.use((err, req, res, next) => {
  err.json = true;
  next(err);
});


module.exports = router;
