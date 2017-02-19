/**
 * Created by xin on 2017/2/18.
 */
const Payables = require('../models/Payables')

exports.paychecksearch = (req,res,next) => {
    let condition = req.query['condition']
    if(condition){
        condition = JSON.parse(condition)
    }
    Payables.find({outDate:{
        $gte:condition.startDate,$lt:condition.endDate
    }},{entries:1,number:1,originOrder:1}).then(entries=>{
        console.log(entries)
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

exports.create = (record) => {
    let payables = new Payables();
    payables.set('number',record.number)
    payables.set('originOrder',record.originOrder)
    payables.set('entries',record.entries)
    payables.set('outDate',record.outDate)
    payables.save().then(()=>{
        console.log(JSON.stringify(payables))
    })
}

exports.createTransport = (record)=>{
    let payables = new Payables();
    payables.set('hasTransport',true)
    payables.set('transport',record.transport)
    payables.save().then(()=>{
        console.log(payables);
    })
}
