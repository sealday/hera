/**
 * Created by seal on 29/12/2016.
 */

const mongoose = require('mongoose');
const User = require('../models').User;

mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost/hera')
  .then(() => {
    return User.find();
  }).then(users => {
  let promises = [];
  users.forEach(user => {
    console.log(user);
    user.defaultProject = user.projects[0];
    console.log(user);
    promises.push(user.save());
  });
  return promises;
})

  .catch(err => {
    console.log(err);
  }).then(() => {
  mongoose.disconnect();
});
