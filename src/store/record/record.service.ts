import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppService, Record } from 'src/app/app.service';
import { LoggerService } from 'src/app/logger/logger.service';
import { User } from 'src/users/users.service';
import { convert } from 'src/utils/pinyin';

@Injectable()
export class RecordService {
  constructor(
    @InjectModel('Record') private recordModel: Model<Record>,
    private loggerService: LoggerService,
    private appService: AppService,
  ) { }

  async delete(recordId: string) {
    const res = await this.recordModel.updateOne({ _id: new Types.ObjectId(recordId) }, { valid: false })
    return res.modifiedCount
  }
  async recover(recordId: string) {
    const res = await this.recordModel.updateOne({ _id: new Types.ObjectId(recordId) }, { valid: true })
    return res.modifiedCount
  }

  async create(body: Record, user: User) {
    let record = new this.recordModel(body)
    // TODO 1) 根据订单类型初始化
    // 2) 订单号计算逻辑
    record.number = await this.appService.genNextNumber('record')
    // 3) 制单人
    record.username = user.username
    // 4) 保存历史订单
    const savedRecord = await record.save()
    // 5) 落下日志
    this.loggerService.logNewRecord(savedRecord, user)
    return savedRecord
  }

  async findById(recordId: string) {
    return this.recordModel.findById(recordId)
  }

  async update(body: Record, recordId: string, user: User) {
    const record = await this.recordModel.findById(recordId)
    const lhs = record.toObject()
    Object.assign(record, body)
    // TODO 记录修改人
    // record.username = user.username
    const updatedRecord = await record.save()
    const rhs = updatedRecord.toObject()
    this.loggerService.logRecordDiff(lhs, rhs, user)
    return updatedRecord
  }

  async updateTransport(body: any, recordId: string, user: User) {
    const record = await this.recordModel.findById(recordId)
    Object.assign(record.transport, body)
    // 标记存在运输单
    record.hasTransport = true
    const updatedRecord = await record.save()
    return updatedRecord
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
