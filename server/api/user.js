/**
 * Created by seal on 13/01/2017.
 */

const User = require('../models').User

const Product = require('../models').Product
const Project = require('../models').Project
exports.login = (req, res, next) => {
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
      throw {
        status: 400,
        message: '这个操作员不存在'
      }
    }
    return Promise.all([user.comparePassword(password), user]);
  }).then(([matched, user]) => {
    if (matched) {
      req.session.user = user;
      return res.send('登录成功！');
    } else {
      throw {
        status: 400,
        message: '密码错误！'
      }
    }
  }).catch((err) => {
    if (err.status) {
      res.status(err.status).end(err.message);
    } else {
      next(err);
    }
  });
};

// 判断是否登录，因为有中间件拦截，所以这里不需要做特别的事情
exports.isLogin = (req, res) => {
  res.end()
};

// 初始化数据
// 加载系统初始化数据
// 包括项目信息、基地数据、用户数据以及
exports.load = (req, res, next) => {
  Promise.all([
    Product.find().sort({ number: 1 }),
    Project.find(),
    User.find(),
  ]).then(([products, projects, users]) => {

    // TODO 这里暂定为第一个找到第一个找到的为基地
    const bases = projects.filter(project => project.type === '基地仓库')
    const base = bases.length > 0 ? bases[0] : null

    res.json({
      message: '加载成功！',
      data: {
        products,
        projects,
        users,
        base,
        user:req.session.user,
      }
    })
  }).catch(err => {
    next(err)
  })
}

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.send('登出成功！');
  });
};

exports.list = (req, res, next) => {
  User.find().then(users => {
    res.json({
      data: {
        users
      }
    })
  }).catch(err => {
    next(err)
  })
}

exports.create = (req, res, next) => {
  if (!req.body.username || !req.body.password || !req.body.profile || !req.body.role) {
    return res.status(400).json({
      message: '表单填写不完整'
    })
  }
  let user = new User(req.body)
  user.save().then(user => {
    res.json({
      message: '创建用户成功',
      data: {
        user
      }
    })
  }).catch(err => {
    next(err)
  })
}

exports.update = (req, res, next) => {
  if (!req.body.username || !req.body.profile || !req.body.role) {
    return res.status(400).json({
      message: '表单填写不完整'
    })
  }
  let id = req.params.id
  User.findById(id).then(user => {
    delete req.body._id // 阻止客户端传来改变的 id
    Object.assign(user, req.body)
    return user.save()
  }).then(user => {
    res.json({
      message: '更新用户成功',
      data: {
        user
      }
    })
  }).catch(err => {
    next(err)
  })
}

exports.saveProfile = (req, res, next) => {
  const password = req.body.password;
  if (!password) {
    return res.end();
  }
  let id = req.params.id
  User.findById(id).then(user => {
    delete req.body._id // 阻止客户端传来改变的 id
    Object.assign(user, req.body)
    return user.save()
  }).then(user => {
    res.json({
      message: '更新用户成功',
      data: {
        user
      }
    })
  }).catch(err => {
    next(err)
  })
}

exports.remove = (req, res, next) => {
  let id = req.params.id
  User.findByIdAndRemove(id).then(user => {
    res.json({
      message: '删除用户成功',
      data: {
        user
      }
    })
  }).catch(err => {
    next(err)
  })
}