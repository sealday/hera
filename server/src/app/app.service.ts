import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { Express } from 'express';
import * as _ from 'lodash'
import * as mime from 'mime-types';
import { Cron } from '@nestjs/schedule';

import { User } from '../users/users.service';
import { Upload } from 'src/schemas/upload.schema';
import { Notification } from 'src/schemas/notification.schema';
import { Setting } from 'src/schemas/setting.schema';

export type Record = any;
export type Product = any;
export type Project = any;
export type Operation = any;
export type Counter = any;
export type Recycle = any;
export type Price = any;
export type Plan = any;
export type Store = any;
export type Contract = any;
export type Company = any;

@Injectable()
export class AppService {

  constructor(
    @InjectModel('Users') private userModel: Model<User>,
    @InjectModel('Record') private recordModel: Model<Record>,
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
    @InjectModel('Project') private projectModel: Model<Project>,
    @InjectModel('Product') private productModel: Model<Product>,
    @InjectModel('Operation') private operationModel: Model<Operation>,
    @InjectModel('Counter') private counterModel: Model<Counter>,
    @InjectModel(Upload.name) private uploadModel: Model<Upload>,
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel('Recycle') private recycleModel: Model<Recycle>,
  ) { }

  async recordCount(storeId: string, direction: string, dateType: string) {
    let today = moment().startOf('day').toDate()
    if (direction) {
      return this.recordModel.countDocuments({
        [direction]: new Types.ObjectId(storeId),
        [dateType]: {
          '$gte': today,
        },
      })
    } else {
      return this.recordModel.countDocuments({
        [dateType]: {
          '$gte': today,
        },
        $expr: {
          $gt: ['$updatedAt', '$createdAt'],
        }
      })
    }
  }

  async load() {
    const [products, projects, users, settings] = await Promise.all([
      this.productModel.find().sort({ number: 1 }),
      this.projectModel.find(),
      this.userModel.find(),
      this.settingModel.findOne({}).sort({ _id: -1 }),
    ])

    // FIXME 这里暂定为第一个找到第一个找到的为基地
    const bases = projects.filter(project => project.type === '基地仓库')
    const base = bases.length > 0 ? bases[0] : null

    return {
      products,
      projects,
      users,
      base,
      config: settings,
    }
  }

  private genQeuryCond(user) {
    if (user.role === '系统管理员') {
      return {}
    } else {
      return { 'user.username': user.username }
    }
  }

  async queryTopKLog(user) {
    const operations = await this.operationModel.find(this.genQeuryCond(user)).sort({ _id: -1 }).limit(10)
    return operations;
  }

  async queryNextKLog(user, lastId) {
    const operations = await this.operationModel
      .find({ _id: { $lt: new Types.ObjectId(lastId) }, ...this.genQeuryCond(user) })
      .sort({ _id: -1 })
      .limit(10)
    return operations;
  }

  async genNextNumber(type: string) {
    const counter = await this.counterModel.findByIdAndUpdate(type, {$inc: {seq: 1}}, {new: true})
    if (counter) {
      return counter.seq
    } else {
      // 不存在此序列先创建
      const result = await this.counterModel.create({ _id: type })
      await result.save()
      return await this.genNextNumber(type)
    }
  }

  async onDeleted(src: string, obj: object, user: User) {
    const recycle = new this.recycleModel({ src, obj, user: _.pick(user, ['username', 'profile.name'])})
    await recycle.save()
  }

  async upload(file: Express.Multer.File) {
    const uploadObject = new this.uploadModel({
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      extension: mime.extension(file.mimetype),
    })
    await uploadObject.save()
    return uploadObject.toObject()
  }

  // 每天凌晨五点刷新
  @Cron('0 0 5 * * *')
  async checkReceiptAndCounterfoil() {
    // 超过五天的出入库提醒
    const setting = await this.settingModel.findOne({}).sort({ _id: -1 })
    // 回单联、存根联提醒
    _.forEach(['receipt', 'counterfoil'], key => {
      setting[key + 'Users'].forEach(async (username: string) => {
        const start = moment().add(-setting[key + 'Timeout'], 'day').startOf('day')
        const end = moment().add(-setting[key + 'Timeout'], 'day').endOf('day')
        const records = await this.recordModel.find({ outDate: { $gte: start, $lte: end } })
        this.notificationModel.create({
          username,
          title: '回单联签收提醒（测试）',
          content: `今日共有 ${records.length} 张回单联超过设定期限未签收`,
          extra: {
            records: records.map(record => ({ number: record.number, _id: record._id })),
          }
        })
      })
    })
  }

  async getNotifications(user: User) {
    return await this.notificationModel.find({ username: user.username }).sort({ _id: -1 }).limit(5)
  }
}
