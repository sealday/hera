/**
 * Created by seal on 30/12/2016.
 */

const mongoose = require('mongoose');
const Project = require('../models').Project;
const Product = require('../models').Product;

mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost/hera')
  .then(() => {
    // 读取初始数据
    global.companyData = {};
    return Product.find();
  }).then(productTypes => {
    global.companyData.productTypes = productTypes;
  })
  .then(() => {
    return Project.find();
  })
  .then(projects => {
    let promises = [];
    projects.forEach(project => {
      if (project.store.length == 0) {
        project.initStore();
        promises.push(project.save());
      }
    });
    return Promise.all(promises);
  })
  .then(() => {
    console.log('更新成功');
  })
  .catch(err => {
    console.log(err);
  }).then(() => {
    mongoose.disconnect();
  });
