/**
 * Created by seal on 27/12/2016.
 */


const User = require('../models/User');
const Project = require('../models/Project');
const mongoose = require('mongoose');
const Order = require('../models/Order');



//TODO 需要处理一下订单的类型
exports.index = (req, res, next) => {
  const user = req.user;

  Project.find({ _id: { $in: user.projects } }).then(projects => {
    let result = [];

    projects.forEach(project => {
      result.push(project);
      result.push(Order.find({ fromProject: project.name }));
      result.push(Order.find({ toProject: project.name }));
    });

    return Promise.all(result);
  }).then(result => {
    let projects = [];
    for (let i = 0; i < result.length; i += 3) {
      result[i].fromOrders = result[i + 1];
      result[i].toOrders = result[i + 2];
      projects.push(result[i]);
    }
    return projects;
  }).then(projects => {
    res.render('index', {
      title: '主页' ,
      page: 'dashboard',
      projects: projects
    });
  }).catch(err => {
    next(err);
  });


};