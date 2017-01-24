/**
 * Created by seal on 29/12/2016.
 *
 * 将 project 中单一的联系人信息 升级成 一组联系人
 */

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Project = require('../models/Project');

mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost/hera')
  .then(()=> {
    return Project.db.collection('projects').find().toArray();
  }, e => {
    console.log(e);
  })
  .then((projects) => {


  projects.forEach(p => {

    let contacts = [{
      name: p.contact,
      phone: p.phone
    }];
    Project.db.collection('projects').findOneAndUpdate({ _id: p._id }, { $set: { contacts: contacts}, $unset: {contact: '', phone: ''}}).then(p => {
      console.log(p);
    });
  });

  }).then(() => {

  mongoose.disconnect();
});
