import * as mongoose from 'mongoose';

export const OperationSchema = new mongoose.Schema({
  level: String, // 操作等级 DANGER/INFO
  type: String, // 操作类型 新增/修改/查询/登录
  timestamp: Number, // 时间戳
  report: Object, // 操作报告
  user: Object, // 操作用户
});