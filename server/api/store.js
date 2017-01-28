/**
 * Created by seal on 05/01/2017.
 */
const Project = require('../models/Project');
const Record = require('../models/Record').Record;
const ObjectId = require('mongoose').Types.ObjectId;

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
    queryAll(req.params.id).then(([inRecords, outRecords]) => {
      console.log(inRecords)
      res.json({
        message: '查询成功',
        data: {
          inRecords,
          outRecords
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