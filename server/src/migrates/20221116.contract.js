print('migrate contract start')
const contracts = db.contracts.find().toArray()
contracts.forEach(contract => {
  const items = contract.items
  const newItems = items.filter(item => item.category !== '计重')
  const weights = items.filter(item => item.category === '计重')
  if (weights.length > 0) {
    newItems.forEach(item => {
      item.weight = weights[0].plan
    })
    db.contracts.updateOne({ _id: contract._id }, {
      $set: {
        items: newItems,
      }
    })
  }
})

print('migrate contract done.')