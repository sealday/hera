import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  role: String, // 权限角色信息 系统管理员、基地管理员、项目部管理员、成本估计管理员、财务管理员
  managed: Array, // 当前管理的项目，只针对项目部管理员设立
  comments: String, // 关于这个角色的备注
  perms: [{
    projectId: mongoose.Schema.Types.ObjectId,
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