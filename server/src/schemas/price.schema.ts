import * as mongoose from 'mongoose';

/**
 *
 * 运费考虑：
 *   - 出库运费
 *   - 入库运费
 *   - 按单运费调整
 *   - 出入库运费不一样（是否需要考虑？）
 *   - 运费需要与产品规格相关联么？
 *
 * 规格定价优于产品定价
 */
export const PriceSchema = new mongoose.Schema({
  name: String,
  date: Date,
  comments: String,
  weightPlan: mongoose.Schema.Types.ObjectId, // 计重方案
  repairPlan: mongoose.Schema.Types.ObjectId, // 维修定价方案
  compensationPlan: mongoose.Schema.Types.ObjectId, // 赔偿定价方案
  userPlans: [{
    productType: String, // 产品类型
    name: String, // 名称
    level: {
      type: String,
      enum: ['产品', '规格'], // 定价到特定产品还是产品规格
    },
    size: String, // 规格
    unitPrice: Number, // 单价
    type: {
      type: String,
      enum: ['数量', '换算数量', '重量'],
    },
    comments: String, // 备注
  }],
  freight: Number, // 运费
  freightType: {
    type: String,
    enum: ['出库', '入库', '双向']
  }
});