print('migrate rule start')
const rules = db.rules.find({category: '计重'}).toArray()
rules.forEach(rule => {
  const result = db.rules.updateMany(
    { _id: rule._id },
    {
      $set: {
        'items.$[].level': '规格',
        'items.$[].countType': '数量'
      }
    }
  )
})

print('migrate rule done.')