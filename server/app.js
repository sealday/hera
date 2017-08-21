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

const apiIndex = require('./api')

// 使用 ES6 的 Promise
mongoose.Promise = global.Promise
// 连接 mongo 数据库
mongoose
  .connect('mongodb://localhost/hera')

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
app.use(cookieParser())

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

app.use('/api',  apiIndex)

app.get('/system/', (req, res, next) => {
  res.send('网站在维护中，请稍后访问！')
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
  res.json({
    message: '出错了！',
    originalError: err
  })
})

// TODO 增加认证的机制
app.onSocketConnection = io => {
  return socket => {
    service.num++
    io.emit('server:num', service.num)
    socket.on('disconnect', () => {
      service.socketMap.delete(socket)
      service.num--
      io.emit('server:num', service.num)
      io.emit('server:users', [...service.socketMap.values()])
    });
    socket.on('client:user', (user) => {
      service.socketMap.set(socket, user)
      io.emit('server:users', [...service.socketMap.values()])
    })
    socket.on('client:click', (click) => {
      console.log(JSON.stringify(click, null, 4))
      const op = new Op(click)
      op.type = 'click'
      op.save().catch((err) => {
        console.error(JSON.stringify(err, null, 4))
      })
    })
  }
}

module.exports = app