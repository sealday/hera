const products = require('./sizes.json')
const weights = require('./products.weight').products
const SCALE_BASED = require('./products.weight').SCALE_BASED
const SIZE_BASED = require('./products.weight').SIZE_BASED
const _ = require('lodash')
const fs = require('fs')

const newProducts = []

const weightMap = {}
_.forEach(weights, (weight) => {
  weightMap[weight.name + '|' + weight.size] = weight
})

_.forEach(products, (product, i) => {
  if (product.sizes.length > 0) {
    _.forEach(product.sizes, (size, j) => {
      const weight = weightMap[product.name + '|' + size]
      const isScaled = !_.isEmpty(product.sizeUnit)
      newProducts.push({
        number: i * 100 + j,
        type: product.type,
        name: product.name,
        size: size,
        countUnit: product.countUnit,
        isScaled: isScaled,
        unit: isScaled ? product.unit : undefined,
        weight: _.isNil(weight) ? 0 : (weight.weight_method !== SIZE_BASED ? (weight.weight * weight.scale).toFixed(3) : weight.weight),
        scale: isScaled ? _.toNumber(size) : undefined
      })
    })
  } else {
    newProducts.push({
      number: i * 100,
      type: product.type,
      name: product.name,
      countUnit: product.countUnit,
      weight: 0,
      isScaled: false,
    })
  }
})


fs.writeFileSync(__dirname + '/products.json', JSON.stringify(newProducts, null, 2))
