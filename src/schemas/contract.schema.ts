import { Schema } from 'mongoose';

/**
 * 合同
 */
export const ContractSchema = new Schema(
  {
    name: String, // 合同名称
    code: String, // 合同编号
    date: Date, // 合同日期
    project: Schema.Types.ObjectId, // 项目部
    address: String, // 合同地点
    comments: String, // 合同备注
    status: String, // 合同状态：完结、进行、已删除
    meta: [{
      tax: Number,
    }],
    items: [{
      category: String, // price、weight、repair、loss
      plan: Schema.Types.ObjectId,
      start: Date,
      end: Date,
    }],
    calcs: [{
      name: String,
      start: Date,
      end: Date,
      history: Schema.Types.Mixed,
      list: Schema.Types.Mixed,
      group: Schema.Types.Mixed,
      nameGroup: Schema.Types.Mixed,
      freightGroup: Schema.Types.Mixed,
    }]
  }, {
  timestamps: true
});