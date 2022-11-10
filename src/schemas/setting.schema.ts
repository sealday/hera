import * as mongoose from 'mongoose';

export const SettingSchema = new mongoose.Schema({
  systemName: String, // 系统名称
  externalNames: [String], // 对外公司名称
  printSideComment: String, // 打印侧边说明
  posts: [String], // 职务列表
}, { timestamps: true });