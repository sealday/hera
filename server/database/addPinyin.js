/**
 * Created by seal on 31/12/2016.
 * 给所有的project加上拼音
 */

const mongoose = require('mongoose');
const Project = require('../models/Project');
const Product = require('../models').Product

mongoose.Promise = global.Promise;
const connection = mongoose.connect('mongodb://localhost/hera');

let start = null;
connection.then(() => {
  start = new Date()

  return Project.find()

}).then(projects => {

  let all = []

  projects.forEach(project => {
    all.push(project.save())
  })

  return Promise.all(all)

}).then(results => {

  return Product.find()


}).then(productTypes => {
  let all = []

  productTypes.forEach(productType => {
    all.push(productType.save())
  })

  return Promise.all(all)
}).then(results => {
  let end = new Date() - start;
  console.log('一共耗时 %d 毫秒', end);
}).catch(err => {
  console.log(err);
}).then(() => {
  mongoose.disconnect();
});

