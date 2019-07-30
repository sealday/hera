const Operation = require('../models/operation')
const ObjectId = require('mongoose').Types.ObjectId
const uid = require('uid-safe').sync
const home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
const helper = require('../utils/my').helper

const logTopK = async () => {
  const operations = await Operation.find().sort({ _id: -1 }).limit(10)
  return operations
}

const userLogTopK = async user => {
  const operations = await Operation.find({ 'user.username': user.username }).sort({ _id: -1 }).limit(10)
  return operations
}

const logNextK = async id => {
  const operations = await Operation.find({ _id: { $lt: id } }).sort({ _id: -1 }).limit(10)
  return operations
}

const userLogNextK = async (id, user) => {
  const operations = await Operation.find({ _id: { $lt: id }, 'user.username': user.username }).sort({ _id: -1 }).limit(10)
  return operations
}

/**
 * TODO 提供分页形式的，用于 PC 客户端的 API 
 * 获取最近 k 条日志
 */
const topK = async (req, res) => {
  const user = req.session.user
  let operations = []
  if (user.role === '系统管理员') {
    operations = await logTopK()
  } else {
    operations = await userLogTopK(user)
  }
  res.json({
    message: '加载成功',
    data: {
      operations }
  })
}


const nextK = async (req, res) => {
  const query = req.query
  const id = ObjectId(query.id)
  const user = req.session.user
  let operations = []
  if (user.role === '系统管理员') {
    operations = await logNextK(id)
  } else {
    operations = await userLogNextK(id, user)
  }
  res.json({
    message: '加载成功',
    data: {
      operations
    }
  })
}

exports.topK = helper(topK)
exports.nextK = helper(nextK)
