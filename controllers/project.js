/**
 * Created by seal on 27/12/2016.
 */
const Project = require('../models/Project');

const projectKeys = ['name', 'fullName', 'contact.name', 'contact.phone', 'address', 'comments', 'tel'];
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

  // TODO 初始化项目所有基础数据 具体有库存的信息交给其他地方的配置处理
  project.current = { '钢管': 0 };

  project.save().then(() => {
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
    return project.save(() => {
      res.send(`更新 ${project.name} 的信息成功`);
    });
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