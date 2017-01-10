/**
 * Created by seal on 11/01/2017.
 */
const File = require('../../models/File');

exports.post =  (req, res, next) => {
  const file = new File(req.file);

  file.save().then(() => {
    res.send('success');
  }).catch(err => {
    next(err);
  });
};

exports.list = (req, res, next) => {
  File.find().then(files => {
    res.json(files);
  }).catch(err => {
    next(err);
  });
};
