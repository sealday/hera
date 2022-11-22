import * as mongoose from 'mongoose';

export const SettingSchema = new mongoose.Schema({
  systemName: String, // 系统名称
  externalNames: [String], // 对外公司名称
  printSideComment: String, // 运输单打印侧边说明
  orderPrintSideComment: String, // 出入库打印侧边说明
  posts: [String], // 职务列表
}, { timestamps: true });