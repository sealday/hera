const ObjectId = require('mongoose').Types.ObjectId
const mongoose = require('mongoose')
const moment = require('moment')

const Record = require('../models').Record
const storeService = require('../service').store
const service = require('../service')
const rentService = require('../service/Rent')
const helper = require('../utils/my').helper
const logger = service.logger


const storeSummary = async (req, res) => {
  logger.logInfo(req.session.user, '查询', { message: '查询库存信息' })
  let condition = req.query['condition']
  if (condition && req.params.id) {
    const params = JSON.parse(condition)
    const [{ inRecords, outRecords }] = await storeService.queryAll(req.params.id, params)
    res.json({
      message: '查询成功',
      data: {
        inRecords,
        outRecords
      }
    })
  } else {
    res.status(400).json({
      message: '错误的请求格式'
    })
  }
}

/**
 *
 * 主要根据对方单位名称搜索仓库信息
 *
 * query.condition 是一个 JSON 字符串
 *
 * 包含字段
 * self: 表示当前仓库
 * other：表示对方单位、仓库
 * startDate: 开始时间
 * endDate: 结束时间
 *
 */
exports.simpleSearch = (req, res, next) => {
  logger.logInfo(req.session.user, '查询', { message: '查询出入库或运输信息' })
  let condition = req.query['condition']

  if (condition) {
    condition = JSON.parse(condition)

    if (!condition.self) {
      return res.status(400).json({
        message: '请求的参数不正确！'
      })
    }

    let match = {
      outDate: {
        $gte: new Date(condition.startDate),
        $lt: new Date(condition.endDate)
      },
      valid: true,
    }

    // 是否查询无效单
    if (_.isBoolean(condition.valid)) {
      match['valid'] = condition.valid
    }

    // 记录类型
    if (condition.type) {
      match['type'] = condition.type
    }

    // 查询运输单
    if (condition.hasTransport) {
      match['hasTransport'] = true
    }

    // 查询车号
    if (condition.carNumber) {
      match['carNumber'] = condition.carNumber
    }

    // 查询收款人
    if (condition.payee) {
      match['transport.payee'] = condition.payee
    }

    // 查询付款方
    if (condition.payer) {
      match['transport.payer'] = condition.payer
    }

    // 查询原始单号
    if (condition.originalOrder) {
      match['originalOrder'] = condition.originalOrder
    }

    let id, vendor
    if (condition.other) {
      // 使用 try catch 来判断是不是 store
      try {
        id = ObjectId(condition.other)
      } catch (e) {
        // 不能转换成 ObjectId 则是vendor
        vendor = condition.other
      }
    }

    // 需要查询对方仓库 调拨单
    if (id) {
      // 如果是公司角度搜索，不加限制条件
      if (condition.company) {
        match['$or'] = [
          { outStock: id },
          { inStock: id },
        ]
      } else {
        // 处理出入库
        if (condition.inOut == '出库') {
          match['$or'] = [
            { inStock: id, outStock: ObjectId(condition.self) },
          ]
        } else if (condition.inOut == '入库') {
          match['$or'] = [
            { outStock: id, inStock: ObjectId(condition.self) },
          ]
        } else {
          match['$or'] = [
            { outStock: id, inStock: ObjectId(condition.self) },
            { inStock: id, outStock: ObjectId(condition.self) },
          ]
        }
      }
    } else {
      // 如果不是公司角度搜索，加限制条件
      if (!condition.company) {
        // 处理出入库
        if (condition.inOut == '出库') {
          match['$or'] = [
            { outStock: ObjectId(condition.self) },
          ]
        } else if (condition.inOut == '入库') {
          match['$or'] = [
            { inStock: ObjectId(condition.self) },
          ]
        } else {
          match['$or'] = [
            { inStock: ObjectId(condition.self) },
            { outStock: ObjectId(condition.self) },
          ]
        }
      }
    }

    // 需要查询对方单位 采购销售
    if (vendor) {
      match['vendor'] = vendor
    }

    // 查询单号 当按单号查询的时候，忽略其他条件
    if (condition.number) {
      match = {
        number: Number(condition.number)
      }
    }

    Record.aggregate([
      {
        $match: match
      }
    ]).then(search => {
      res.json({
        message: '查询成功！',
        data: {
          search
        }
      })

    }).catch(err => {
      next(err)
    })
  } else {
    res.status(400).json({
      message: '错误的请求格式'
    })
  }
}

/**
 *
 * 计算租金
 *
 * query.condition 是一个 JSON 字符串
 *
 * 包含字段
 * project: 目标项目
 * startDate: 开始时间
 * endDate: 结束时间
 *
 */
const rent = async (req, res) => {
  logger.logInfo(req.session.user, '查询', { message: '计算租金信息' })
  let condition = req.query['condition']

  if (condition) {
    condition = JSON.parse(condition)

    const startDate = new Date(condition.startDate)
    const endDate = new Date(condition.endDate)
    const timezone = 'Asia/Shanghai'
    const project = ObjectId(condition.project)
    const pricePlanId = ObjectId(condition.planId)

    const result = await rentService.calculate({
      startDate,
      endDate,
      timezone,
      project,
      pricePlanId,
    })
    res.json({
      message: '查询成功！',
      data: {
        rent: result,
      }
    })
  } else {
    res.status(400).json({
      message: '错误的请求格式'
    })
  }
}

exports.rent = helper(rent)
exports.queryAll = helper(storeSummary)
