import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Record, AppService } from 'src/app/app.service';
import { User } from 'src/users/users.service';
import { convert } from 'src/utils/pinyin';

@Injectable()
export class RecordService {
  constructor(
    @InjectModel('Record') private recordModel: Model<Record>,
    private appService: AppService,
  ) { }

  async delete(recordId: string) {
    const res = await this.recordModel.updateOne({ _id: Types.ObjectId(recordId) }, { valid: false })
    return res.nModified
  }
  async recover(recordId: string) {
    const res = await this.recordModel.updateOne({ _id: Types.ObjectId(recordId) }, { valid: true })
    return res.nModified
  }

  async create(body: Record, user: User) {
    let record = new this.recordModel(body)
    // TODO 1) 根据订单类型初始化
    // 2) 订单号计算逻辑
    record.number = await this.appService.genNextNumber('record')
    // 3) 制单人
    record.username = user.username
    // TODO 4) 落下日志
    // 5) 保存历史订单
    return record.save()
  }

  async findById(recordId: string) {
    return this.recordModel.findById(recordId)
  }

  async update(body: Record, recordId: string, user: User) {
    const record = await this.recordModel.findById(recordId)
    const lhs = record.lean()
    Object.assign(record, body)
    // TODO 记录修改人
    // record.username = user.username
    const updatedRecord = await record.save()
    const rhs = record.lean()
    // TODO 落下日志
    // logger.logRecordDiff(lhs, rhs, user)
    return updatedRecord.lean()
  }

  async updateTransport(body: any, recordId: string, user: User) {
    const record = await this.recordModel.findById(recordId)
    Object.assign(record.transport, body)
    // 标记存在运输单
    record.hasTransport = true
    const updatedRecord = await record.save()
    return updatedRecord.lean()
  }

  async findPayer() {
    const result = await this.recordModel.distinct('transport.payer', { 'transport.payer': { $ne: '' } })
    const payers = result.map((payer) => ({
      name: payer,
      pinyin: convert(payer),
    }))
    return payers
  }

  async updateTransportPaidStatus(paid: boolean, recordId: string) {
    await this.recordModel.findOneAndUpdate({ _id: recordId }, { $set: { transportPaid: paid } })
    // TODO 落下日志
    return paid
  }

  async updateTransportCheckedStatus(checked: boolean, recordId: string) {
     await this.recordModel.findOneAndUpdate({ _id: recordId}, { $set: { transportChecked: checked } })
    // TODO 落下日志
     return checked
  }
}
