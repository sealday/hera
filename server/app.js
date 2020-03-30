const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const chalk = require('chalk')
const multer = require('multer')
const moment = require('moment')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
// const express-validator 可以考虑使用
const compression = require('compression')
const service = require('./service')
const Op = require('./models/op')
const Project = require('./models').Project;
const User = require('./models').User;
const config = require('../config');

const apiIndex = require('./api')

// 使用 ES6 的 Promise
mongoose.Promise = global.Promise
// 连接 mongo 数据库
mongoose
  .connect(`mongodb://localhost/${ config.db }`)
  .then(() => {
    return Promise.all([Project.find(), User.find()]);
  })
  .then(([projects, users]) => {
    if (projects.length === 0) {
      new Project(config.base).save()
    }
    if (users.length === 0) {
      new User({
        username: 'hera',
        password: '123456',
        type: 258,
        profile: {
          name: '超级管理员'
        },
        role: '系统管理员'
      }).save()
    }
  });

mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'))
  process.exit();
});

const app = express()

// compress all
app.use(compression())

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.enable('trust proxy')
logger.token('log-time', () => moment().format('MM-DD HH:mm:ss'))
app.use(logger('[:method] (:log-time) :url :status :remote-addr :response-time ms'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cookieParser())

app.use((req, _, next) => {
  req.headers.cookie = ''
  console.log('req.headers', req.headers)
  req.cookies = {
    'connect.sid': req.headers['x-hera-token']
  }
  next()
})



app.use(express.static(path.join(__dirname, 'public')))
service.root = __dirname

app.use(session({
  secret: 'Hera God',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}))

app.use((req, res, next) => {
  // console.log('---', req.cookies['connect.sid'])
  next()
})
app.use('/api',  apiIndex)

app.get('/system/', (req, res, next) => {
  res.send('网站在维护中，请稍后访问！')
})

// 重定向到新版登录页面
app.get('/system/login.html', (req, res, next) => {
  res.redirect('./#/login')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  if (err.status !== 404) {
    console.log(err)
  }
  res.status(err.status || 500)
  if (err.status) {
    res.json(err)
  } else {
    res.json({
      message: '出错了！',
      originalError: err.message ? err.message : err
    })
  }
})

// TODO 增加认证的机制
app.onSocketConnection = io => {
  return socket => {
    socket.on('disconnect', () => {
      service.socketMap.delete(socket)
      io.emit('server:users', [...service.socketMap.values()])
    });
    socket.on('client:user', ({ user, token }) => {
      service.socketMap.set(socket, user)
      io.emit('server:users', [...service.socketMap.values()])
    })
  }
}

module.exports = app
