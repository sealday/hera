/**
 * Created by wangjiabao on 2017/2/6.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SigninSchema = new Schema({
    worker:Schema.Types.ObjectId,//工人id
    project:Schema.Types.ObjectId,//项目id
    signintime:Date,//签到时间
    signouttime:Date,//签退时间

})
