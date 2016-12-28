/**
 * Created by seal on 26/12/2016.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const projectSchema = new Schema({
  name: String,
  fullName: String,
  contact: String,
  phone: String,
  address: String,
  comments: String,
  current: Mixed,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
