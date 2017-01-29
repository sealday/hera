/**
 * Created by seal on 13/01/2017.
 */

const Project = require('../models/Project');

/*
列出所有的项目
 */
exports.list = (req, res, next) => {
  Project.find().then(projects => {
    res.json({
      data: {
        projects
      }
    });
  }).catch(err => {
    next(err);
  });
};

/*
创建新的项目
 */
exports.create = (req, res, next) => {
  let project = new Project(req.body);
  project.save().then(project => {
    res.json({
      message: '保存成功',
      data: {
        project
      }
    })
  }).catch(err => {
    next(err);
  })
}

/*
更新项目的时候，发送的是全部的数据，也就包括id的数据
 */
exports.update = (req, res, next) => {
  const id = req.params.id
  Project.findByIdAndUpdate(id, req.body).then(project => {
    res.json({
      message: '更新成功',
      data: {
        project
      }
    })
  }).catch(err => {
    next(err)
  })
}

/*
获取单个项目的详细信息
 */
exports.detail = (req, res, next) => {
  Project.findById(req.params.id).then(project => {
    res.json({
      data: {
        project
      }
    })
  }).catch(err => {
    next(err)
  })
}
