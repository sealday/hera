/**
 * Created by seal on 30/12/2016.
 */

// 拆分全称变成简称

const mongoose = require('mongoose');
const Project = require('../models/Project');

mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost/hera')
  .then(() => {
    return Project.find();
  })
  .then(projects => {
    let promises = [];
    projects.forEach(project => {
      project.abbr = project.name;
      project.company = project.fullName;
      promises.push(project.save());
    });
    return Promise.all(promises);
  })
  .then(() => {
    console.log('success');
  })
  .catch(err => {
    console.log(err);
  }).then(() => {
    mongoose.disconnect();
  });
