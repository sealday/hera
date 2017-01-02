/**
 * Created by seal on 27/12/2016.
 */
const Project = require('../models/Project');
const PurchaseOrder = require('../models/PurchaseOrder');
const TransferOrder = require('../models/TransferOrder');
const CarrydownOrder = require('../models/CarrydownOrder');
const RejectOrder = require('../models/RejectOrder');

const projectKeys = [
  'name',
  'tel',
  'contact.name',
  'contact.phone',
  'address',
  'comments',
  'company',
  'companyTel',
  'type',
  'base'
];

exports.middleware = (req, res, next) => {
  // 登录才判断
  if (req.user) {
    const user = req.user;
    let current = req.session.current;
    let projects = global.companyData.projects;

    if (user.projects.length == 0) {
      // 除了第一次 hera 登录，否则不会出现这个情况！
      current = '无任何一个项目管理权限';
    } else if (!current || !(current._id in projects)) {
        current = projects[user.projects[0]];
    }

    // 会话中保存
    req.session.current = current;
    // 提供给视图使用
    res.locals.current = current;
    res.locals.projects = projects;
    res.locals.ownProjects = [];

    user.projects.forEach(p => {
      res.locals.ownProjects.push(projects[p]);
    });
  }

  next();
};

/**
 * 专用于 project/:projectId 的中间件
 * 用来统一项目 id
 */
exports.middleware2 = (req, res, next) => {

  const projects = global.companyData.projects;
  let id = req.params.projectId;
  req.session.current = res.locals.current =  projects[id];

  next();
};

exports.index = (req, res, next) => {
  PurchaseOrder.find().where('valid', true).limit(5).then(latestPurchaseOrders => {
    res.locals.latestPurchaseOrders = latestPurchaseOrders;
    return TransferOrder.find().where('valid', true).where('fromProject', req.session.current._id).limit(5);
  }).then(latestTransferOutOrders => {
    res.locals.latestTransferOutOrders = latestTransferOutOrders;
    return TransferOrder.find().where('valid', true).where('toProject', req.session.current._id).limit(5);
  }).then(latestTransferInOrders => {
    res.locals.latestTransferInOrders = latestTransferInOrders;
    return CarrydownOrder.find().limit(5);
  }).then(latestCarrydownOrders => {
    res.locals.latestCarrydownOrders = latestCarrydownOrders;
    return RejectOrder.find().limit(5);
  }).then(latestRejectOrders => {
    res.locals.latestRejectOrders = latestRejectOrders;
  }).then(() => {
    res.render('project/index');
  });
};


/**
 * 创建新项目
 */
exports.post = (req, res, next) => {

  let project = new Project();
  projectKeys.forEach(key => {
    project[key] = req.body[key];
  });

  if (!Array.isArray(project['contact.name'])) {
    project['contacts'].push({
      name: project['contact.name'],
      phone: project['contact.phone']
    })
  } else {
    for (let i = 0; i < project['contact.name'].length; i++) {
      project['contacts'].push({
        name : project['contact.name'][i],
        phone: project['contact.phone'][i]
      });
    }
  }

  project.initStore();

  project.save().then(() => {
    // 更新程序中保存的数据库信息
    global.companyData.projects[project.id] = project;
    res.send(`添加 ${project.name} 的信息成功`);
  }).catch(err => {
    next(err);
  });
};

/**
 * 更新项目信息
 */
exports.updateInfo = (req, res, next) => {
  const id = req.params.id;
  Project.findById(id).then(project => {
    projectKeys.forEach(key => {
      project[key] = req.body[key];
    });

    project['contacts'].splice(0);
    if (!Array.isArray(project['contact.name'])) {
      project['contacts'].push({
        name: project['contact.name'],
        phone: project['contact.phone']
      })
    } else {
      for (let i = 0; i < project['contact.name'].length; i++) {
        project['contacts'].push({
          name : project['contact.name'][i],
          phone: project['contact.phone'][i]
        });
      }
    }

    return project;
  }).then(project => {
    return project.save();
  }).then(project => {
    global.companyData.projects[project.id] = project;
    res.send(`更新 ${project.name} 的信息成功`);
  }).catch(err => {
    next(err);
  });
};


/**
 * 删除项目
 */
exports.delete = (req, res, next) => {
  const id = req.params.id;

  Project.findByIdAndRemove(id).then(() => {
    res.send('删除项目成功！');
  }).catch(err => {
    next(err);
  });

};