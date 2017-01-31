/**
 * Created by wangjiabao on 2017/1/29.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkerSchema = new Schema({
    name:String,//姓名
    age:Number,//年龄
    address:String,//家庭住址
    idcard:String,//身份证号
    gender:String,//性别
    phone:String,//电话号码
    category:String,//工种
    birthday:Date,//出生日期
    picture:String//身份证照片
})

const Worker = mongoose.model('Worker', WorkerSchema);
module.exports = Worker;