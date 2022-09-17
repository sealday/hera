import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ = require('lodash');
import * as moment from 'moment';
import { Model } from 'mongoose';
import { Contract } from 'src/app/app.service';
import { StoreService } from 'src/store/store.service';
import { User } from 'src/users/users.service';

@Injectable()
export class ContractService {
  constructor(
    private storeService: StoreService,
    @InjectModel('Contract') private contractModel: Model<Contract>,
  ) { }

  async find() {
    return this.contractModel.find({ status: { '$ne': '已删除' } }).sort({ _id: -1 })
  }

  async findById(id: String) {
    return this.contractModel.findById(id)
  }

  async update(id: String, body: any) {
    return this.contractModel.updateOne({ _id: id }, { $set: body})
  }

  async updateStatus(id: String, status: String) {
    return this.contractModel.updateOne({ _id: id }, { $set: { status: status }})
  }

  async addItem(id: String, item: any) {
    return this.contractModel.updateOne({ _id: id }, { $push: { items: item }})
  }

  async deleteItem(id: String, itemId: String) {
    return this.contractModel.updateOne({ _id: id }, { $pull: { items: { _id: itemId }}})
  }

  async addCalc(id: String, calc: any, user: User) {
    const contract = await this.findById(id)
    // 按添加时间 TODO
    const rentRuleId = _.get(_.find(_.reverse([...contract.items]), item => item.category === '租金'), 'plan')
    const otherRuleId = _.get(_.find(_.reverse([...contract.items]), item => item.category === '非租'), 'plan')
    const weightRuleId = _.get(_.find(_.reverse([...contract.items]), item => item.category === '计重'), 'plan')
    if (!(rentRuleId || otherRuleId)) {
      // 至少一个
      throw new Error('至少需要有一个计算价格的规则')
    }
    const rent = await this.storeService.calculate({
      startDate: new Date(calc.start),
      endDate: moment(calc.end).add(1, 'day').toDate(),
      rules: {
        rent: rentRuleId,
        other: otherRuleId,
        weight: weightRuleId,
      },
      user: user,
      project: contract.project,
    }) 
    calc.history = rent.history
    calc.list = rent.list
    calc.group = rent.group
    calc.nameGroup = rent.nameGroup
    calc.debug = rent.debug
    return this.contractModel.updateOne({ _id: id }, { $push: { calcs: calc }})
  }

  async restartCalc(id: String, calc: any, user: User) {
    // TODO 事务实现
    await this.deleteCalc(id, calc._id)
    return this.addCalc(id, calc, user)
  }

  async deleteCalc(id: String, calcId: String) {
    return this.contractModel.updateOne({ _id: id }, { $pull: { calcs: { _id: calcId }}})
  }

  async create(body: Contract) {
    // 初始状态
    body.status = '进行'
    const contract = await new this.contractModel(body).save()
    return contract
  }

}

