import * as mongoose from 'mongoose';

export const SettingSchema = new mongoose.Schema({
  systemName: String, // 系统名称
  externalNames: [String], // 对外公司名称
  printSideComment: String, // 打印侧边说明
}, { timestamps: true });