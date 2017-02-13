/**
 * Created by wangjiabao on 2017/1/29.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const WorkerSchema = new Schema({
    name: String,//姓名
    age: Number,//年龄
    address: String,//家庭住址
    idcard: String,//身份证号
    gender: String,//性别
    phone: String,//电话号码
    category: String,//工种
    birthday: Date,//出生日期
    picture: String,//身份证照片
    valid: Boolean,//身份是否有效
    jointime: Date,//进场时间
    project: Schema.Types.ObjectId,//所属项目id
    sign: [{
            signintime: Date,//签到时间
            signouttime: Date,//签退时间
            signinaddition:String,//备注
            signoutaddition:String

    }
    ]//签到数组
})

const Worker = mongoose.model('Worker', WorkerSchema);
module.exports = Worker;