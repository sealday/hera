/**
 * Created by seal on 26/12/2016.
 */

const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const Tenant = require('../models/Tenant');
const Project = require('../models/Project');
const ProductType = require('../models/ProductType');
const Order = require('../models/Order');

router.get('/', (req, res, next) => {
  Order.find().then(orders => {
  });
  res.render('order/index');
});

router.all('/create', (req, res, next) => {
  let step = req.query.step || 0;

  if (step == 0) {
    // 填写基本信息
    Tenant.find().then(function (tenants) {
      let tenantNames = [];
      tenants.forEach(tenant => {
        tenantNames.push(tenant.name);
      });
      Project.find().then(function (projects) {
        let projectNames = [];
        projects.forEach(project => {
          projectNames.push(project.name);
        });
        res.render('order/create_0', {
          title    : '填写基本信息',
          tenants  : tenantNames,
          projects : projectNames
        });
      });
    });
  } else if (step == 1) {
    // 填写物料明细

    const id = req.query.id;

    res.render('order/create_1', { title: '填写物料明细' , id: id});
  } else if (step == 2) {
    // 填写运输信息

    const id = req.query['id'];
    Order.findById(id).then(order => {
      Project.findOne({name: order.project}).then(project => {
        Project.findById('5861091cb26663f449966d9b').then(company => {
          res.render('order/create_2', {
            title  : '填写运输信息',
            project: project,
            company: company
          });
        });
      });
    });
  } else if (step == 3) {
    // 说明结束了
  }
});

router.get('/:id', (req, res, next) => {
  res.render('order/detail', { title: '详单' });
});

router.post('/', (req, res, next) => {
  let order = new Order();
  order.date = req.body.date;
  order.project = req.body.project;
  //order.carNumber = req.body.carNumber;
  //order.carFee = req.body.carFee;
  order.save().then(order => {
    res.send(order._id);
  });
});

// 保存发归料具体数据
router.post('/:id', (req, res, next) => {
  const id = req.params['id'];
  const entries = JSON.parse(req.body['entries']);

  entries.forEach(entry => {
    entry.orderId = id;
  });

  Product.insertMany(entries).then(() => {
    res.json('success');
  });

});

/**
 * 创建调出单页面
 * @param req
 * @param res
 * @param next
 */
exports.create = (req, res, next) => {
  // TODO 将路径和函数分离开写，会出现我刚才出现的错误，记错我在路径里取的名字
  // 我在路径里取的名字是 projectId 我记成了 id
  const id = req.params['projectId'];

  res.locals.info = req.query['info'] || '';
  res.locals.error = req.query['error'] || '';

  Promise.all([
    Tenant.find(),
    Project.find()
  ]).then(result => {

    let tenants = result[0].map(tenant => tenant.name);
    // TODO 使用这样的写法也许会比较清晰，也许不会，但是性能会下降，这里遍历了三次 projects
    // 由于 projects 不大，所以可以接受

    let currentProject = result[1].find(project => project.id == id);
    let projects = result[1]
      .filter(project => project.id != id)
      .map(project => project.name);

    let stores = result[1].filter(project => project.type == '基地仓库');

    let defaultToProject = projects[0];
    if (currentProject.type != '基地仓库') {
      defaultToProject = stores[0];
    }

    res.render('order/create', {
      title: '调出表填写',
      tenants,
      projects,
      currentProject,
      productTypes: companyData.productTypes,
      stores,
      defaultToProject
    });
  }).catch(err => {
    next(err);
  });
};

exports.postOrder = (req, res, next) => {
  let orderForm = {};
  // TODO 我们有没有那种需要填空白单子的需求？
  const formKeys = ['tenant', 'toProject', 'date', 'entry', 'fromProject'];
  formKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });

  if (formKeys.some(key => !orderForm[key])) {
    return res.redirect(req.path + '/create' + '?error=信息填写不完整！');
  }

  const optionalFormKeys = ['comments', 'carFee', 'carNumber'];
  optionalFormKeys.forEach(k => {
    orderForm[k] = req.body[k] || '';
  });


  if (!Array.isArray(orderForm.entry)) {
    orderForm.entry = [orderForm.entry];
  }
  orderForm.entry = orderForm.entry.map(entry => JSON.parse(entry));

  let total = {};
  orderForm.entry.forEach(entry => {
    if (entry.name in total) {
      total[entry.name] += entry.total * 1;
    } else {
      total[entry.name] = entry.total * 1;
    }
  });

  let order = new Order();
  for (let k in orderForm) {
    order[k] = orderForm[k];
  }
  order.total = total;
  order.username = req.user.username;

  order.save().then(order => {
    orderForm.entry.forEach(entry => {
      entry.orderId = order._id;
    });
    return Product.create(orderForm.entry)
  }).then(() => {
    return Promise.all([Project.findOne({ name: order.fromProject }), Project.findOne({ name: order.toProject })])
  }).then(projects => {
    let fromProject = projects[0];
    let toProject = projects[1];
    fromProject.current = fromProject.current || {};
    toProject.current = toProject.current || {};
    for (let k in order.total) {
      if (k in fromProject.current) {
        fromProject.current[k] -= order.total[k];
      } else {
        fromProject.current[k] = -order.total[k];
      }
      if (k in toProject.current) {
        toProject.current[k] += order.total[k];
      } else {
        toProject.current[k] = order.total[k];
      }
    }
    return Promise.all([fromProject.save(), toProject.save()]);
  }).then(() => {
    res.redirect('/');
  }).catch(err => {
    next(err);
  });
};

exports.details = (req, res, next) => {
  // TODO 将路径和函数分离开写，会出现我刚才出现的错误，记错我在路径里取的名字
  // 我在路径里取的名字是 projectId 我记成了 id
  const id = req.params['projectId'];

  Promise.all([
    Tenant.find(),
    Project.find()
  ]).then(result => {

    let tenants = result[0].map(tenant => tenant.name);
    // TODO 使用这样的写法也许会比较清晰，也许不会，但是性能会下降，这里遍历了三次 projects
    // 由于 projects 不大，所以可以接受

    let currentProject = result[1].find(project => project.id == id);
    let projects = result[1]
      .filter(project => project.id != id)
      .map(project => project.name);

    res.render('order/details', {
      title: '调拨详单',
      tenants,
      projects,
      currentProject
    });
  }).catch(err => {
    next(err);
  });
};

exports.purchaseCreate = (req, res, next) => {
  const id = req.params['projectId'];

  res.locals.info = req.query['info'] || '';
  res.locals.error = req.query['error'] || '';

  Promise.all([
    Tenant.find(),
    Project.find()
  ]).then(result => {
    let tenants = result[0].map(tenant => tenant.name);
    let currentProject = result[1].find(project => project.id == id);
    let projects = result[1].map(project => project.name);

    res.render('order/purchase', {
      title: '采购单填写',
      tenants,
      projects,
      currentProject,
      productTypes: companyData.productTypes
    });
  }).catch(err => {
    next(err);
  });
};

exports.router = router;
