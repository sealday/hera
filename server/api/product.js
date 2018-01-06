/**
 * Created by seal on 11/01/2017.
 */
const Product = require('../models').Product;

exports.list = (req, res, next) => {
  Product.find().then((products) => {
    res.json({
      data: {
        products
      }
    });
  }).catch(err => {
    next(err);
  });
};

exports.create = (req, res, next) => {
  const product = new Product(req.body)
  product.save().then(() => {
    res.end()
  }).catch((err) => {
    next(err)
  })
}

exports.delete = (req, res, next) => {
  const number = req.params.number
  Product.remove({ number: number }).then(() => {
    res.end()
  }).catch((err) => {
    next(err)
  })
}

exports.update = (req, res, next) => {
  const number = req.params.number
  Product.findOneAndUpdate(number, req.body, { new: true }).then((product) => {
    res.json({
      message: '更新成功',
      data: {
        product
      }
    })
  }).catch(err => {
    next(err)
  })
}