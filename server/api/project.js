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

    const result = await rentService.calculate({
      startDate,
      endDate,
      timezone,
      projectId,
      pricePlanId,
    })
    const item = {
      name: '对账单', // 名称
      startDate: startDate, // 开始时间
      endDate: endDate, // 结束时间
      createdAt: new Date(), // 创建时间
      updatedAt: new Date(), // 更新时间
      planId: pricePlanId,  // 价格计划
      username: req.session.user.username, // 操作员
      content: {
        history: result[0].history,
        list: result[0].list,
        group: result[0].group,
        nameGroup: result[0].nameGroup,
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

const itemDetail = async (req, res) => {
  const project = await Project.findById(req.params.id)
  const items = project.items.filter(i => i._id.toString() === req.params.itemId)
  if (items.length < 1) {
    res.status(404).json({
      message: '不存在该账单'
    })
  } else {
    res.json({
      message: '获取成功！',
      data: {
        item: items[0],
      }
    })
  }
}

const deleteItem = async (req, res) => {
  const project = await Project.findById(req.params.id)
  const items = project.items.filter(i => i._id.toString() === req.params.itemId)
  if (items.length < 1) {
    res.status(404).json({
      message: '不存在该账单'
    })
  } else {
    project.items = project.items.filter(i => i._id.toString() !== req.params.itemId)
    const newProject = await project.save()
    res.json({
      message: '删除成功！',
      data: {
        project: newProject,
      }
    })
  }
}

exports.addItem = helper(addItem)
exports.itemDetail = helper(itemDetail)
exports.deleteItem = helper(deleteItem)
