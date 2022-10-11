import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { Express } from 'express';
import * as _ from 'lodash'
import * as mime from 'mime-types';

import { User } from '../users/users.service';
import { Upload } from 'src/schemas/upload.schema';

export type Record = any;
export type Product = any;
export type Project = any;
export type Setting = any;
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
    @InjectModel('Setting') private settingModel: Model<Setting>,
    @InjectModel('Project') private projectModel: Model<Project>,
    @InjectModel('Product') private productModel: Model<Product>,
    @InjectModel('Operation') private operationModel: Model<Operation>,
    @InjectModel('Counter') private counterModel: Model<Counter>,
    @InjectModel(Upload.name) private uploadModel: Model<Upload>,
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
    return counter.seq
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
}
