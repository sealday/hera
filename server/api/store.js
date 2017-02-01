/**
 * Created by seal on 05/01/2017.
 */
const Project = require('../models/Project');
const Record = require('../models/Record').Record;
const ObjectId = require('mongoose').Types.ObjectId;
const service = require('../service')

/**
 * 查询指定 project 的库存
 * @param projectId
 */

function queryAll(projectId) {
  return Record.aggregate([
    {
      $match: {outStock: ObjectId(projectId)},
    },
    {
      $unwind: '$entries'
    },
    {
      $group: {
        _id: {
          name: '$entries.name',
          size: '$entries.size'
        },
        sum: {
          $sum: '$entries.count'
        }
      }
    }
  ]).then(outRecords => {
    console.log(outRecords)
    return Promise.all([Record.aggregate([
      {
        $match: {inStock: ObjectId(projectId)},
      },
      {
        $unwind: '$entries'
      },
      {
        $group: {
          _id: {
            name: '$entries.name',
            size: '$entries.size'
          },
          sum: {
            $sum: '$entries.count'
          }
        }
      }
    ]), outRecords])
  })
}

exports.queryAll = (req, res, next) => {
  if (req.params.id) {

    if (service.isValidStockCache(req.params.id)) {
      console.log('缓存命中')
      let inRecords = service.stock[req.params.id].inRecords
      let outRecords = service.stock[req.params.id].outRecords
      res.json({
        message: '查询成功',
        data: {
          inRecords,
          outRecords
        }
      })
    } else {
      queryAll(req.params.id).then(([inRecords, outRecords]) => {
        service.refreshStockCache(req.params.id, inRecords, outRecords)
        res.json({
          message: '查询成功',
          data   : {
            inRecords,
            outRecords
          }
        })
      }).catch(err => {
        next(err)
      })
    }
  } else {
    res.status(400).json({
      message: '错误的请求格式'
    })
  }
}

/**
 *
 * 按条件搜索仓库信息
 * query.condition 是一个 JSON 字符串
 *
 */
exports.search = (req, res, next) => {
  let condition = req.query['condition']

  if (condition) {
    condition = JSON.parse(condition)

    let match = {
      outDate: {
        $gte: new Date(condition.startDate),
        $lt: new Date(condition.endDate)
      },
      'entries.count': {
        $gte: 0
      }
    }

    // 记录类型
    if (condition.type) {
      match['type'] = condition.type
    }

    // 约束最小数量
    if (condition.startCount) {
      match['entries.count']['$gte'] = Number(condition.startCount)
    }

    // 约束最大数量
    if (condition.endCount) {
      match['entries.count']['$lte'] = Number(condition.endCount)
    }

    // 根据名称
    if (condition.name) {
      match['entries.name'] = condition.name

      // 根据规格
      if (condition.size) {
        match['entries.size'] = condition.size
      }
    }

    if (condition.outStock) {
      match['outStock'] = ObjectId(condition.outStock)
    }

    if (condition.inStock) {
      match['inStock'] = ObjectId(condition.inStock)
    }

    Record.aggregate([
      {
        $unwind: '$entries'
      },
      {
        $match: match
      },
      {
        $project: {
          // 默认包含了id
          outStock: '$outStock',
          inStock: '$inStock',
          outDate: '$outDate',
          name: '$entries.name',
          size: '$entries.size',
          count: '$entries.count',
          number: '$number',
          type: '$type',
          vendor: '$vendor'
          //recordId: '$recordId'
        }
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