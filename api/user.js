/**
 * Created by seal on 13/01/2017.
 */

const User = require('../models/User');

exports.login = (req, res) => {
  const username = req.body['username'] || '';
  const password = req.body['password'] || '';

  // TODO 改用 validate api
  if (!username) {
    return res.status(400).send('用户名不能为空！');
  }

  if (!password) {
    return res.status(400).send('密码不能为空！');
  }

  User.findOne({ username: username }).then(user => {
    if (!user) {
      return res.status(400).send('这个操作员不存在');
    }
    return Promise.all([user.comparePassword(password), user]);
  }).then(([matched, user]) => {
    if (matched) {
      req.session.user = user;
      return res.send('登录成功！');
    } else {
      return res.status(400).send('密码错！');
    }
  }).catch((err) => {
    console.log(err);
    return res.status(500).send('服务器端出错！');
  });
};

exports.isLogin = (req, res) => {
  // 不需要做什么事情，只需要返回200，没有登录的话，会由中间件拦截！
  res.end();
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.send('登出成功！');
  });
};
