import * as mongoose from 'mongoose';

export const CompanySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  tc: String, // 纳税人类别
  tin: String, // 纳税人识别号
  addr: String, // 地址
  tel: String, // 电话
  bank: String, // 开户行
  account: String, // 账号
  code: String, // 行号
  role: String, // 角色
}, { timestamps: true });