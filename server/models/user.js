/**
 * Created by seal on 27/12/2016.
 */
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  role: String, // 保存角色信息，系统管理员、基地管理员、项目部管理员、成本估计管理员、财务管理员
  managed: Array, // 当前管理的项目，只针对项目部管理员设立
  comments: String, // 关于这个角色的备注
  perms: [{
    projectId: ObjectId,
    query: Boolean,
    insert: Boolean,
    update: Boolean,
  }], // 权限

  projects: Array, // 暂时不用，拟定用来保存常用项目列表
  defaultProject: String,
  type: Number, // 258 是超级管理员

  profile: {
    name: String,
  },

}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

module.exports = mongoose.model('User', userSchema);
