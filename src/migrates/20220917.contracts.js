print('migrate contracts')

const contracts = db.contracts.find().toArray()
contracts.forEach(contract => {
  let hasWeight = false
  print(contract.items.length)
  if (contract.items.length > 0) {
    contract.items.forEach(item => {
      if (item.category === 'weight' || item.category === '计重') {
        hasWeight = true
      }
    })
  }
  if (!hasWeight && contract.items.length > 0) {
    const items = contract.items.reverse()
    const item = items.find(item => item.category === '租金' || item.category === 'price')
    const plan = db.prices.findOne({ _id: item.plan })
    if (plan) {
      if (plan.weightPlan) {
        const weightPlan = { ...item, plan: plan.weightPlan, category: '计重' }
        const result = db.contracts.updateOne({ _id: contract._id }, { $push: { items: weightPlan } })
        print(result)
      }
    }
  }
})
const rentResult = db.contracts.updateMany({}, { $set: { 'items.$[e].category': '租金' } }, { arrayFilters: [{ "e.category": 'price' }] })
print(rentResult)
const weightResult = db.contracts.updateMany({}, { $set: { 'items.$[e].category': '计重' } }, { arrayFilters: [{ "e.category": 'weight' }] })
print(weightResult)
print('migrate contracts done')