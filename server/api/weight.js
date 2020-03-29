const _ = require('lodash')
const mongoose = require('mongoose')

const Weight = require('../models').Weight
const ObjectId = mongoose.Types.ObjectId
const helper = require('../utils/my').helper

const list = async (req, res, next) => {
  const weights = await Weight.find()
  res.json({
    data: {
      weights
    }
  })
}

const create = async (req, res, next) => {
  const plan = new Weight(req.body)
  await plan.save()
  res.end()
}

const deletePlan = async (req, res, next) => {
  const id = req.params.id
  await Weight.remove({ _id: ObjectId(id) })
  res.end()
}

const update = async (req, res, next) => {
  const id = req.params.id
  const newPlan = _.omit(req.body, ['_id'])
  const plan = await Weight.findOne({ _id: ObjectId(id) })
  plan.entries = []
  Object.assign(plan, newPlan)
  await plan.save()
  res.json({
    message: '更新成功'
  })
}

exports.list = helper(list)
exports.create = helper(create)
exports.delete = helper(deletePlan)
exports.update = helper(update)