/**
 * Created by wangjiabao on 2017/1/29.
 */

const Worker = require('../models/Worker')

exports.list = (req,res,next)=>{
    Worker.find().then(workers=>{
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
    const workerinfo = req.body;
    let worker = new Worker(workerinfo);
    worker.save().then(()=>{
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
    Worker.findByIdAndUpdate(id,req.body).then(()=>{
        res.json({
            message:'更新成功'
        })
    }).catch(err=>{
        next(err);
    })
}

exports.delete =(req,res,next)=>{
    const id = req.params.id;
    Worker.findByIdAndRemove(id).then(()=>{
        res.json({
            message:'删除成功'
        })
    }).catch(err=>{
        next(err);
    })
}