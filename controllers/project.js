/**
 * Created by seal on 27/12/2016.
 */


const Project = require('../models/Project');
const User = require('../models/User');
const async = require('async');


exports.index = (req, res, next) => {

  const info = req.query['info'] || '';
  const error = req.query['error'] || '';

  Promise.all([Project.find(), User.find()]).then(result => {
    res.render('project/index', {
      title: '项目主页面',
      projects: result[0],
      page: 'manager',
      users: result[1],
      info, error
    });
  }).catch(err => {
    next(err);
  });


};


exports.post = (req, res, next) => {

  let project = new Project();
  ['name', 'fullName', 'contact', 'phone', 'address', 'comments'].forEach(key => {
    project[key] = req.body[key];
  });

  // 初始化对象 Mixed 类型需要自己初始化
  project.current = {};

  project.save().then(() => {
    res.redirect(`/project?info=添加 ${project.name} 的信息成功`);
  }).catch(err => {
    next(err);
  });
};

exports.updateInfo = (req, res, next) => {
  const id = req.params.id;
  Project.findById(id).then(project => {
    ['name', 'fullName', 'contact', 'phone', 'address', 'comments'].forEach(key => {
      project[key] = req.body[key];
    });
    project.save(() => {
      res.redirect(`/project?info=更新 ${project.name} 的信息成功`);
    }, err => {
      next(err);
    });
  }, err => {
    next(err);
  });
};


exports.delete = (req, res, next) => {
  const id = req.params.id;

  Project.findByIdAndRemove(id).then(() => {
    res.redirect('/project?info=删除项目成功！');
  }).catch(err => {
    next(err);
  });

};