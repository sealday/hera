/**
 * Created by seal on 11/01/2017.
 */
const Product = require('../models').Product;

exports.list = (req, res, next) => {
  Product.find().then(articles => {
    res.json({
      data: {
        articles
      }
    });
  }).catch(err => {
    next(err);
  });
};
