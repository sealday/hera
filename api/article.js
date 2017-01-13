/**
 * Created by seal on 11/01/2017.
 */
const ProductType = require('../models/ProductType');

exports.list = (req, res, next) => {
  ProductType.find().then(articles => {
    res.json(articles);
  }).catch(err => {
    next(err);
  });
};
