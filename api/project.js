/**
 * Created by seal on 13/01/2017.
 */

const Project = require('../models/Project');

exports.list = (req, res) => {
  Project.find().then(projects => {
    res.json(projects);
  }).catch(err => {
    next(err);
  });
};
