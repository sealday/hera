/**
 * Created by seal on 29/12/2016.
 */

const Project = require('../models/Project');
const User = require('../models/User');
/**
 * 管理中心中间件
 */
exports.middleware = (req, res, next) => {
  if (req.user.username = 'hera') {
    next();
  } else {
    next('你没有权限访问这个页面！');
  }
};

/**
 * 管理中心首页
 */
exports.index = (req, res, next) => {
  const info = req.query['info'] || '';
  const error = req.query['error'] || '';

  Promise.all([Project.find(), User.find()]).then(result => {
    res.render('control/index', {
      title: '管理中心',
      projects: result[0],
      page: 'control',
      users: result[1],
      info, error
    });
  }).catch(err => {
    next(err);
  });
};
