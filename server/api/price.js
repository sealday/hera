const Price = require('../models').Price
const moment = require('moment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Product = require('../models').Product
const _ = require('lodash')
const async = require('async')
const helper = require('../utils/my').helper

const newPlan = {
  _id: ObjectId('5a56ff25af16eb8d5163df9c'),
  name: '基础方案',
  date: moment('2018-01-01').toDate(),
  comments: '用于展示价格方案如何使用',
  userPlans: [
    {
      name: '钢管', // 名称
      level: '产品',
      unitPrice: 0.04, // 单价
      type: '换算数量',
    },
    {
      name: '扣件', // 名称
      size: '直接',
      level: '规格',
      unitPrice: 30, // 单价
      type: '数量',
    },
    {
      name: '扣件', // 名称
      size: '十字',
      level: '规格',
      unitPrice: 30, // 单价
      type: '数量',
    },
  ],
  freight: 120, // 运费
  freightType: '出库',
}

/**
 * 生成计算用价格方案
 * TODO 指定规格的优先级高于指定产品
 * @param plan
 * @param callback
 */
const generate = async (plan) => {
  return new Promise((resolve, reject) => {
    async.map(plan.userPlans, async (plan) => {
      const filter = { name: plan.name }
      if (plan.level === '规格') {
        filter.size = plan.size
      }
      const products = await Product.find(filter)
      return _.map(products, (product) => ({
        number: product.number,
        unitPrice: plan.unitPrice,
        type: plan.type,
      }))
    }, (err, results) => {
      if (err) {
        return reject(err)
      }
      plan.entries = _.concat(...results)
      resolve(plan)
    })
  })
}

const test = () => {
  mongoose
    .connect('mongodb://localhost/hera')
  generate(newPlan).then((plan) => {
    const price = new Price(plan)
    price.save()
  })
}

exports.list = (req, res, next) => {
  Price.find().then((prices) => {
    res.json({
      data: {
        prices
      }
    });
  }).catch(err => {
    next(err);
  });
};

exports.create = (req, res, next) => {
  const newPlan = req.body
  generate(newPlan).then((plan) => {
    const price = new Price(plan)
    return price.save()
  }).then(() => {
    res.end()
  }).catch((err) => {
    next(err)
  })
}

exports.delete = (req, res, next) => {
  const id = req.params.id
  Price.remove({ _id: ObjectId(id) }).then(() => {
    res.end()
  }).catch((err) => {
    next(err)
  })
}

const update = async (req, res, next) => {
  const id = req.params.id
  const newPlan = _.omit(req.body, ['_id'])

  const plan = await generate(newPlan)
  const oldPlan = await Price.findOne({ _id: ObjectId(id) })
  oldPlan.entries = []
  Object.assign(oldPlan, plan)
  await oldPlan.save()
  res.json({
    message: '更新成功'
  })
}

exports.update = helper(update)

