/**
 * Created by xin on 2017/2/18.
 */
const Record = require('../models/Record').Record

exports.paychecksearch = (req,res,next) => {
    let condition = req.query['condition']
    if(condition){
        condition = JSON.parse(condition)
    }
    Record.find({outDate:{
        $gte:condition.startDate,$lt:condition.endDate
    }},{entries:1}).then(entries=>{
        res.json({
            message:'查询成功',
            data:{
                entries
            }
        })
    }).catch(err=>{
        next(err)
    })
}

