/**
 * Created by seal on 05/01/2017.
 */


const Project = require('../models/Project');
const StockRecord = require('../models/StockRecord');
const ObjectId = require('mongoose').Types.ObjectId;

exports.index = (req, res, next) => {

  const projectId = req.query['project'] || '';

  if (projectId) {
    Project.find().then(projects => {
      res.locals.projects = projects;
      return StockRecord.aggregate([
        {
          $match: {outStock: ObjectId(projectId)},
        },
        {
          $unwind: '$entries'
        },
        {
          $group: {
            _id: {
              name: '$entries.name',
              size: '$entries.size'
            },
            sum: {
              $sum: '$entries.count'
            }
          }
        }
      ]);
    }).then(result => {
      res.locals.outRecords = result;
      return StockRecord.aggregate([
        {
          $match: {inStock: ObjectId(projectId)},
        },
        {
          $unwind: '$entries'
        },
        {
          $group: {
            _id: {
              name: '$entries.name',
              size: '$entries.size'
            },
            sum: {
              $sum: '$entries.count'
            }
          }
        }
      ])
    }).then(result => {
      res.locals.inRecords = result;
      return Project.findById(projectId);
    }).then(project => {
      res.locals.project = project;
      res.render('store/index');
    });


  } else {
    Project.find().then(projects => {
      res.render('store/index', {
        projects
      });
    });
  }
};
