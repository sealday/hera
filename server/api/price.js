const Price = require('../models').Price
const moment = require('moment')
const mongoose = require('mongoose')
const Product = require('../models').Product
const _ = require('lodash')

const newPlan = {
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
      level: '产品',
      unitPrice: 0.04, // 单价
      type: '换算数量',
    },
  ],
  freight: 120, // 运费
  freightType: '出库',
}

/**
 * 生成计算用价格方案
 * @param plan
 * @returns {*}
 */
const generate = async (plan) => {
  const entries = []
  const {
    '产品': productPlans,
    '规格': sizePlans,
  } = _.groupBy(plan.userPlans, (plan) => plan.level)
  _.forEach(productPlans, (p) => {
    const product = await Product.find({ name: p.name }).sort({ number: 1 })
    entries.push({
      number: product.number,
      unitPrice: p.unitPrice,
      type: p.type,
    })
  })
  _.forEach(sizePlans, (p) => {
    Product.find({ name: p.name, size: p.size }).then((product) => {
      entries.push({
        number: product.number,
        unitPrice: p.unitPrice,
        type: p.type,
      })
    })
  })
  plan.entries = entries
  return plan
}

mongoose
  .connect('mongodb://localhost/hera')
const price = new Price(generate(newPlan))

console.log(price)
