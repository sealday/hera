import * as mongoose from 'mongoose';

/**
 * 方案
 * - 重量方案
 * - 租金方案
 * - 赔偿价格方案
 * - 维修价格方案
 */
export const PlanSchema = new mongoose.Schema({
  name: String,
  date: Date,
  comments: String,
  type: { type: String }, // 计划类型
  entries: [{
    type: { type: String }, // 产品类型
    name: String, // 产品名称
    size: String, // 产品规格
    // 重量方案
    weight: Number, // 单位重量
    // 租金方案、赔偿价格方案、维修价格方案
    // 定价到特定产品还是产品规格
    level: { type: String, enum: ['产品', '规格'] },
    price: Number, // 单价
    calType: { type: String, enum: ['数量', '换算数量', '重量'] }, // 计算类型
    comments: String, // 备注
  }],
});