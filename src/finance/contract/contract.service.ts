import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
    return this.contractModel.find({ status: { '$ne': '已删除' }})
  }

  async findById(id: String) {
    return this.contractModel.findById(id)
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
    let pricePlanId = null
    for (let i = contract.items.length - 1; i >= 0; i--) {
      if (contract.items[i].category === 'price') {
        pricePlanId = contract.items[i].plan
      }
    }
    // TODO
    if (!pricePlanId) {
      throw '没有找到合适的租金方案'
    }
    const rent = await this.storeService.calculate({
      startDate: new Date(calc.start),
      endDate: moment(calc.end).add(1, 'day').toDate(),
      pricePlanId: pricePlanId,
      user: user,
      project: contract.project,
    }) 
    calc.history = rent.history
    calc.list = rent.list
    calc.group = rent.group
    calc.nameGroup = rent.nameGroup
    calc.freightGroup = rent.freightGroup
    return this.contractModel.updateOne({ _id: id }, { $push: { calcs: calc }})
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

