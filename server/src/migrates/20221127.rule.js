print('migrate rule start')
const rules = db.rules.find({category: '非租'}).toArray()
rules.forEach(rule => {
  const result = db.rules.updateMany(
    { _id: rule._id },
    {
      $set: {
        'items.$[].countSource': '手动输入'
      }
    }
  )
})

print('migrate rule done.')