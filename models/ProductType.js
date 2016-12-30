/**
 * Created by seal on 26/12/2016.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const productTypeSchema = new Schema({
  type: String,
  name: String,
  sizes: [String],
  unit: String,
});


const ProductType = mongoose.model('ProductType', productTypeSchema);

module.exports = ProductType;
