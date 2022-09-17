print('migrate rule start')
db.rules.drop()
const prices = db.prices.find().toArray()
prices.forEach(price => {
  const rule = {
    _id: price._id,
    name: price.name,
    date: price.date,
    category: '租金',
    comments: price.comments,
    items: price.userPlans.map(plan => ({
      level: plan.level,
      product: {
        type: plan.productType,
        name: plan.name,
        size: plan.size,
      },
      countType: plan.type,
      unitPrice: plan.unitPrice,
      comments: plan.comments,
    }))
  }
  db.rules.insert(rule)
})
const weights = db.plans.find({ type: 'weight' }).toArray()
weights.forEach(weight => {
  const rule = {
    _id: weight._id,
    name: weight.name,
    date: weight.date,
    category: '计重',
    comments: weight.comments,
    items: weight.entries.map(entry => ({
      product: {
        type: entry.type,
        name: entry.name,
        size: entry.size,
      },
      weight: entry.weight,
      comments: entry.comment,
    }))
  }
  db.rules.insert(rule)
})

print('migrate rule done.')