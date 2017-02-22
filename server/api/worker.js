/**
 * Created by wangjiabao on 2017/1/29.
 */

const Worker = require('../models').Worker

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

exports.signin = (req,res,next)=>{
    const id = req.params.id;
    let signin = {
        signintime:req.body.signintime,
        signinaddition:req.body.signinaddition}
    console.log(JSON.stringify(signin))
    Worker.findByIdAndUpdate(id,{$push:{sign:signin}}).then(()=>{
        res.json({
            message:'签到成功'
        })
    }).catch(err=>{
        next(err)
    })
}

exports.signout = (req,res,next)=>{
    const id = req.params.id;
    let signout = {
        signouttime:req.body.signouttime,
        signoutaddition:req.body.signoutaddition}

    Worker.findByIdAndUpdate(id,{$push:{sign:signout}}).then(()=>{
        res.json({
            message:'签退成功'
        })
    }).catch(err=>{
        next(err)
    })
}


exports.getsigninfolist = (req,res,next)=>{
    const starttime=req.body.starttime;
    const endtime = req.body.endtime;
    const projectid = req.body.projectid;
    const workerid = req.body.workerid;
    Worker.findById(workerid,{project:projectid,sign:{signintime:{$not:{$lt:starttime}}},signouttime:{$lt:endtime}}).then((workerinfo)=>{
        const signArray = workerinfo.sign;
        const signindays = signArray.length;
        console.log(signindays);
    })

}
