db.plans.drop()
const weights = db.weights.find().toArray()
weights.forEach(weight => {
  weight.type = 'weight'
  weight.entries.forEach(entry => {
    entry.weight = entry.unitWeight
    delete entry.unitWeight
  })
});
db.plans.insert(weights)