/**
 * Created by seal on 11/01/2017.
 */
const Product = require('../models').Product
const Record = require('../models').Record
const _ = require('lodash')

exports.list = (req, res, next) => {
  Product.find().sort({ number: 1 }).then((products) => {
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
  const newProduct = _.omit(req.body, ['_id'])
  Product.findOne({ number: number }).then((product) => {
    const shouldUpdate = !_.isEqual(
        _.pick(newProduct, ['type', 'name', 'size']),
        _.pick(product, ['type', 'name', 'size']))
    Object.assign(product, newProduct)
    return Promise.all([product.save(), shouldUpdate])
  }).then(([product, shouldUpdate]) => {
    if (shouldUpdate) {
      return Record.collection.updateMany({}, { $set: {
        "entries.$[e].name": product.name,
        "entries.$[e].size": product.size,
        "entries.$[e].type": product.type,
      }}, {
        multi: true,
        arrayFilters: [ { 'e.number': Number(product.number)  } ]
      })
    }
  }).then(() => {
    res.json({
      message: '更新成功'
    })
  }).catch((err) => {
    next(err)
  })
}