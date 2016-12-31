/**
 * Created by seal on 30/12/2016.
 */

const mongoose = require('mongoose');
const ProductType = require('../models/ProductType');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/hera')
  .then(() => {
  })
  .catch(err => {
    console.log(err);
  })
  .then(() => {
    mongoose.disconnect();
  });
