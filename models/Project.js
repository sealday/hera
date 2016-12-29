/**
 * Created by seal on 26/12/2016.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const projectSchema = new Schema({
  name: String,
  fullName: String,
  contacts: [{
    name: String,
    phone: String
  }],
  tel: String, // 公司电话
  address: String,
  comments: String,
  current: Mixed,
});

// 不适合加在这里
//projectSchema.pre('save', function(next) {
//  if (!this.get('current')) {
//    this.set('current', {});
//  }
//  next();
//});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
