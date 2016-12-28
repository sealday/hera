/**
 * Created by seal on 27/12/2016.
 */
const User = require('../models/User');

exports.middleware = (req, res, next) => {
  req.user = req.session.user;
  res.locals.user = req.session.user;

  if (req.user) {
    // 已经登录的用户
    return next();
  }

  if (req.path == '/' || req.path == '/login') {
    // 访问登录页面不需要检查权限
    return next();
  }

  // 保存之前要登录的页面
  req.session.originalUrl = req.originalUrl;
  res.redirect(`/login?error=访问这个页面 ${req.originalUrl} 请先登录`);
};

exports.login = (req, res) => {
  const error = req.query.error || '';

  if (req.user) {
    return res.redirect('/');
  }

  res.render('login', {
    title: '登录页面',
    error: error
  });
};

exports.logout = (req, res) => {
  req.session.user = null;
  res.redirect('/login?info=您已经成功退出系统！');
};

exports.postLogin = (req, res) => {
  const username = req.body['username'] || '';
  const password = req.body['password'] || '';

  if (!username) {
    return res.redirect('/login?error=用户名不能为空！');
  }

  if (!password) {
    return res.redirect('/login?error=密码不能为空！');
  }

  User.findOne({ username: username }).then((user) => {
    if (!user) {
      return res.redirect('/login?error=没有找到这个操作员！')
    }
    user.comparePassword(password, (err, matched) => {
      if (err) {
        console.log(err);
        return res.redirect('/login?error=服务器出错，请稍后重试！');
      }
      if (matched) {
        req.session.user = user;
        // TODO 这里保存了原本路径，如果有问题过来检查一下，这个写法待确认
        console.log(req.session.originalUrl);
        const url = req.session.originalUrl || '/';
        return res.redirect(url);
      } else {
        return res.redirect('/login?error=密码错误！');
      }

    });
  }, (err) => {
    console.log(err);
    return res.redirect('/login?error=服务器端出错！');
  });
};

exports.deleteUser = (req, res, next) => {
  const id = req.params.id;

  User.findByIdAndRemove(id).then(() => {
    res.redirect('/project?info=删除操作员成功！');
  }).catch(err => {
    next(err);
  });

};

exports.updateUser = (req, res, next) => {
  const id = req.params.id;
  let updatedUser = {};
  ['username', 'name', 'project', 'password'].forEach(key => {
    updatedUser[key] = req.body[key] || '';
  });

  if (!Array.isArray(updatedUser['project'])) {
    updatedUser['projects'] = [updatedUser['project']];
  } else {
    updatedUser['projects'] = updatedUser['project'];
  }
  delete updatedUser['project'];

  User.findById(id).then(user => {

    if (updatedUser.password) {
      user.password = updatedUser.password;
    }

    ['username', 'name', 'projects'].forEach(key => {
      user[key] = updatedUser[key];
    });

    // TODO 这样子分两步会有事务问题吧？ 在只有一个人操作的情况下不会
    user.save().then(() => {
      return res.redirect('/project?info=更新操作员信息成功');
    }).catch(err => {
      next(err);
    });
  }).catch(err => {
    next(err);
  });
};

exports.newUser = (req, res, next) => {
  const username = req.body.username || '';
  const password = req.body.password || '';
  const name = req.body.name || '';
  const project = req.body.project || '';
  if (!name || !username || !password || !project) {
    return res.redirect('/project?error=信息填写不完整');
  }

  let projects = [];
  if (!Array.isArray(project)) {
    projects[0] = project;
  } else {
    projects = project;
  }
  let user = new User;
  user.username = username;
  user.password = password;
  user.profile.name = name;
  projects.forEach(project => {
    user.projects.push(project);
  });

  console.log('添加前的 user ');
  console.log(user);
  user.save().then((user) => {
    console.log('添加后的 user ');
    console.log(user);
    return res.redirect('/project?info=添加用户成功！');
  }).catch(err => {
    next(err);
  });
};

