import * as mongoose from 'mongoose';

/**
 * 回收站
 */
export const RecycleSchema = new mongoose.Schema({
  src: String, // 原始表名
  obj: Object, // 被删除的对象
  user: Object, // 执行删除的人
}, { timestamps: true });