/**
 * Created by seal on 10/01/2017.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const FileSchema = new Schema({
  originalname: String,
  filename: String,
  path: String,
  mimetype: String,
  size: Number
});

const File = mongoose.model('File', FileSchema);

module.exports = File;
