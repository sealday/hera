/**
 * Created by seal on 30/12/2016.
 */

const mongoose = require('mongoose');
const Project = require('../models/Project');
const ProductType = require('../models/ProductType');

mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost/hera')
  .then(() => {
    // 读取初始数据
    global.companyData = {};
    return ProductType.find();
  }).then(productTypes => {
    global.companyData.productTypes = productTypes;
  })
  .then(() => {
    return Project.find();
  })
  .then(projects => {
    let newProjects = [];
    projects.forEach(project => {
      if (project.store.length == 0) {
        project.initStore();
        newProjects.push(project);
      }
    });
    return newProjects;
  })
  .then(projects => {
    let promises = [];
    projects.forEach(p => {
      promises.push(Project.findByIdAndUpdate(p._id, {  store: p.store  }));
    });

    return Promise.all(promises);
  })
  .then(result => {
    console.log('更新成功');
  })
  .catch(err => {
    console.log(err);
  }).then(() => {
    mongoose.disconnect();
  });
