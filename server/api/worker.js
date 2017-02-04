/**
 * Created by wangjiabao on 2017/1/29.
 */

const Worker = require('../models/Worker')

exports.list = (req,res,next)=>{
    Worker.find({valid:true}).then(workers=>{
        res.json({
            data:{
                workers
            }
        });
    }).catch(err=>{
        next(err);
    })
}


exports.create = (req,res,next)=>{
    const workerreq = req.body;
    let worker = new Worker(workerreq);
    worker.set("valid",true)

    worker.save().then(workerinfo=>{
        res.json({
            message:'保存成功',
            data:{
                workerinfo
            }
        })
    }).catch(err=>{
        next(err);
    })
}

exports.update = (req,res,next)=>{
    const id = req.params.id;
    const workerinfo = req.body

    Worker.findByIdAndUpdate(id,req.body,{new:true}).then(()=>{
        res.json({
            message:'更新成功',
            data: {
                workerinfo
            }
        })
    }).catch(err=>{
        next(err);
    })
}

exports.delete =(req,res,next)=>{
    const id = req.params.id;
    Worker.findByIdAndUpdate(id,{valid:false}).then(()=>{
        res.json({
            message:'删除成功'
        })
    }).catch(err=>{
        next(err);
    })
}