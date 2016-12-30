/**
 * Created by seal on 27/12/2016.
 */


const mongoose = require('mongoose');
const User = require('../models/User');

// 连接 mongo 数据库
mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost/hera')
  .then(() => {
    let user = new User();
    user.username = 'hera';
    user.password = 'hera';
    user.type = 258;
    user.profile.name = '超级管理员';
    user.save().then(() => {
      console.log('用户名 hera 密码 hera 注册成功');
    }, (err) => {
      if (err.code == 11000) {
        console.log('用户名重复！');
      } else {
        console.log(err);
      }
    }).then(() => {
      mongoose.disconnect();
    });

  }, (err) => {
    console.log('连接出错');
    console.log(err);
  });
