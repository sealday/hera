/**
 * Created by seal on 10/01/2017.
 */
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/'});

const router = express.Router();
const File = require('../../models/File');

router.get('/', (req, res) => {
  res.send('nothing here');
});

router.post('/file', upload.single('file'), (req, res) => {
  const file = new File(req.file);
  file.save().then(() => {
    console.log(req.file);
    res.send('success');
  }).catch(err => {
    next(err);
  });
});

router.get('/file', (req, res) => {
  File.find().then(files => {
    res.json(files);
  }).catch(err => {
    err.json = true;
    next(err);
  });
});



module.exports = router;
