const moment = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const _ = require('lodash')
const async = require('async')

const Price = require('../models').Price
const Product = require('../models').Product
const helper = require('../utils/my').helper

const list = async (req, res, next) => {
  const prices = await Price.find()
  res.json({
    data: {
      prices
    }
  })
}

const create = async (req, res, next) => {
  const plan = new Price(req.body.weightPlan ? req.body : _.omit(req.body, ['weightPlan']))
  await plan.save()
  res.end()
}

const remove = async (req, res, next) => {
  const id = req.params.id
  await Price.remove({ _id: ObjectId(id) })
  res.end()
}

const update = async (req, res, next) => {
  const id = req.params.id
  const newPlan = req.body.weightPlan ? _.omit(req.body, ['_id']) : _.omit(req.body, ['_id', 'weightPlan']) 

  const oldPlan = await Price.findOne({ _id: ObjectId(id) })
  Object.assign(oldPlan, newPlan)
  await oldPlan.save()
  res.json({
    message: '更新成功'
  })
}

exports.create = helper(create)
exports.delete = helper(remove)
exports.list = helper(list)
exports.update = helper(update)

