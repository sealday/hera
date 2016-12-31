/**
 * Created by seal on 27/12/2016.
 */
const User = require('../models/User');
const Project = require('../models/Project');

/**
 * 用户中间件
 */
exports.middleware = (req, res, next) => {
  req.user = req.session.user;
  res.locals.user = req.session.user;

  if (req.user) {
    // 已经登录的用户
    return next();
  }

  if (req.path == '/' || req.path == '/login' || req.path == '/logout') {
    // 访问登录页面不需要检查权限
    return next();
  }

  // 保存之前要登录的页面
  req.session.originalUrl = req.originalUrl;
  res.redirect(`/login?error=访问这个页面 ${req.originalUrl} 请先登录`);
};

/**
 * 登录页面
 */
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

/**
 * 处理退出请求
 */
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login?info=您已经成功退出系统！');
  });
};

/**
 * 处理登录请求
 */
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


/**
 * 删除用户
 */
exports.deleteUser = (req, res, next) => {
  const id = req.params.id;

  User.findById(id).then(u => {
    if (u.type == '258') {
      return res.send('删除失败！不能删除系统管理员。');
    }
    if (req.user._id == id) {
      return res.send('删除失败！不能删除自己。');
    }
    return User.findByIdAndRemove(id);
  }).then(() => {
      res.send('删除操作员成功！');
  }).catch(err => {
    next(err);
  });
};

/**
 * 更新用户
 */
exports.updateUser = (req, res, next) => {
  const id = req.params.id;
  let updatedUser = {};
  ['username', 'name', 'project', 'password'].forEach(key => {
    updatedUser[key] = req.body[key] || '';
  });

  if (!updatedUser.project) {
    return res.send('没有选择项目！');
  }

  if (!Array.isArray(updatedUser['project'])) {
    updatedUser['projects'] = [updatedUser['project']];
  } else {
    updatedUser['projects'] = updatedUser['project'];
  }
  delete updatedUser['project'];

  User.findById(id).then(user => {
    // 密码特殊处理，如果请求中包含密码则修改密码，否则不修改
    if (updatedUser.password) {
      user.password = updatedUser.password;
    }

    ['username', 'name', 'projects'].forEach(key => {
      user[key] = updatedUser[key];
    });

    // TODO 使用find and update api
    return user.save();
  }).then(user => {
    // 只有管理员自己修改自己的时候会出现这个问题
    if (user._id == req.session.user._id) {
      req.session.user = user;
    }
    global.companyData.users[user._id] = user;
    res.send('更新操作员信息成功！');
  }).catch(err => {
    next(err);
  });
};

/**
 * 创建新用户
 */
exports.newUser = (req, res, next) => {
  const username = req.body['username'] || '';
  const password = req.body['password'] || '';
  const name = req.body['name'] || '';
  const project = req.body['project'] || '';
  if (!name || !username || !password || !project) {
    return res.send('信息填写不完整！');
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

  user.save().then(() => {
    global.companyData.users[user._id] = user;
    res.send('添加用户成功！');
  }).catch(err => {
    next(err);
  });
};

