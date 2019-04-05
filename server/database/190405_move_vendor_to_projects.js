const mongoose = require('mongoose')
const Record = require('../models').Record
const Project = require('../models').Project


const app = async () => {
  await mongoose.connect('mongodb://localhost/hera')
  const vendors = await Record.distinct('vendor')
  await Promise.all(vendors.map(vendor => new Project({
    company: vendor,
    name: '供应商',
    contacts: [{
      name: '供应商联系人',
      phone: '1888888888',
    }],
    type: '供应商',
    address: '供应商地址',
  }).save()))
  await Project.updateMany({}, { $set: { banks: [{name: '', bank: '', account: ''}] }})
  await mongoose.disconnect()
}

app()
