const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const chalk = require('chalk');
const multer = require('multer');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// const express-validator 可以考虑使用
const ProductType = require('./models/ProductType');
const Project = require('./models/Project');
const User = require('./models/User');
const compression = require('compression');

const index = require('./controllers/index');
const apiIndex = require('./controllers/api');

// 使用 ES6 的 Promise
mongoose.Promise = global.Promise;
// 连接 mongo 数据库
mongoose
  .connect('mongodb://localhost/hera')
  .then(() => {
    // 读取初始数据
    global.companyData = {};
    return ProductType.find();
  }).then(productTypes => {
    global.companyData.productTypes = productTypes;
    global.companyData.productTypeMap = {};
    productTypes.forEach(type => {
      global.companyData.productTypeMap[type.name] = type;
    });
    return Project.find();
  }).then(projects => {
    global.companyData.projects = {};
    projects.forEach(p => {
      global.companyData.projects[p.id] = p;
    });
    return User.find();
  }).then(users => {
    global.companyData.users = {};
    users.forEach(u => {
      global.companyData.users[u.id] = u;
    });
  }).catch(err => {
    console.log(err);
  });

mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

const app = express();

// compress all
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/uploads/', (req, res, next) => {
  const filename = req.query['filename'] || '';
  if (filename) {
    req.url = `/${filename}`;
    next();
  } else {
    next('error');
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'Hera God',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

app.use('/api',  apiIndex);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {

  if (next.json) {
    res.status(err.status || 500);
    res.json({
      message: '出错了！',
      originalError: err
    })
  } else {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

// 在线人数
let num = 0;
app.onSocketConnection = io => {
  return socket => {
    num++;
    io.emit('server:num', num);
    socket.on('disconnect', function(){
      num--;
      io.emit('server:num', num);
    });
  };
};


module.exports = app;
