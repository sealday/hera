/**
 * Created by xin on 2017/2/18.
 */
const Payable = require('../models/Payable')

exports.paycheckSearch = (req,res,next) => {
  let condition = req.query['condition']

  if(condition){
    condition = JSON.parse(condition)
  }

  Payable.find({
    createdAt: {
      $gte: condition.startDate,
      $lt: condition.endDate,
    }
  }).then(payables => {

    res.json({
      message: '查询成功',
      data: {
        payables
      }
    })

  }).catch(err => {
    next(err)
  })
}
