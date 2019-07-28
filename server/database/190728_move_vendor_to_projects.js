const mongoose = require('mongoose')
const Record = require('../models').Record
const Project = require('../models').Project

const app = async () => {
  await mongoose.connect('mongodb://localhost/hera')
  let vendors = await Record.find({ vendor: { $exists: true }, type: '采购' })
  const promises = []
  for (let vendor of vendors) {
    const projects = await Project.find({ company: vendor.vendor })
    const project = projects[0]
    vendor.outStock = project._id
    promises.push(vendor.save())
  }
  vendors = await Record.find({ vendor: { $exists: true }, type: '销售' })
  for (let vendor of vendors) {
    const projects = await Project.find({ company: vendor.vendor })
    const project = projects[0]
    vendor.inStock = project._id
    promises.push(vendor.save())
  }
  await Promise.all(promises)
  await mongoose.disconnect()
}

app()
