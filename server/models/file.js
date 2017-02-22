/**
 * Created by seal on 10/01/2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  originalname: String,
  filename: String,
  path: String,
  mimetype: String,
  size: Number
});

module.exports = mongoose.model('File', fileSchema)
