/**
 * Created by seal on 13/01/2017.
 */

const Project = require('../models').Project;
const helper = require('../utils/my').helper
const rentService = require('../service/Rent')
const moment = require('moment')
const ObjectId = require('mongoose').Types.ObjectId;

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
  Project.findByIdAndUpdate(id, req.body, { new: true }).then(project => {
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

const addItem = async (req, res, next) => {
  let condition = req.body

  if (condition) {
    const projectId = ObjectId(req.params.id)
    const startDate = new Date(condition.startDate)
    const endDate = new Date(condition.endDate)
    const timezone = 'Asia/Shanghai'
    const pricePlanId = ObjectId(condition.planId)
    const project = await Project.findById(projectId)

    // 检查是否有区间重合
    const items = project.items.filter(item => item.name === '对账单')
    items.forEach(item => {
      if (!(moment(item.startDate).startOf('day') > moment(endDate).startOf('day')
      || moment(item.endDate).startOf('day') < moment(startDate).startOf('day'))) {
        throw {
          status: 400,
          message: '对账单区间重合！',
        }
      }
    })

    const result = await rentService.calculate({
      startDate,
      endDate,
      timezone,
      projectId,
      pricePlanId,
    })
    console.log(JSON.stringify(result[0], null, 4))
    const item = {
      name: '对账单', // 名称
      startDate: startDate, // 开始时间
      endDate: endDate, // 结束时间
      createdAt: new Date(), // 创建时间
      updatedAt: new Date(), // 更新时间
      username: req.session.user.username, // 操作员
      content: {
        history: result[0].history,
        list: result[0].list,
        group: result[0].group,
      }
    }
    project.items.push(item)
    const newProject = await project.save()
    res.json({
      message: '生成成功！',
      data: {
        project: newProject,
      }
    })
  } else {
    res.status(400).json({
      message: '错误的请求格式'
    })
  }
}

exports.addItem = helper(addItem)
