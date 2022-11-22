import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ = require('lodash');
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
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
    return this.contractModel.find({ status: { '$ne': '已删除' } }, { calcs: 0 }).sort({ _id: -1 })
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

  inRange(planStart: Date, planEnd: Date, calcStart: string, calcEnd: string) {
    const calcStartDay = moment(calcStart).startOf('day')
    const calcEndDay = moment(calcEnd).add(1, 'day').startOf('day')
    const planStartDay = moment(planStart).startOf('day')
    const planEndDay = moment(planEnd).add(1, 'day').startOf('day')
    return calcStartDay >= planStartDay && calcEndDay <= planEndDay
  }

  async findProbablyContract(record: any) {
    const contracts = _.concat([],
      await this.contractModel.find({ project: record.inStock, status: { $ne: '已删除' } }),
      await this.contractModel.find({ project: record.outStock, status: { $ne: '已删除' } }),
    )
    return contracts.find(contract => contract.items.length > 0)
  }

  async updateCalcStatus(record: any) {
    const contracts = _.concat([],
      await this.contractModel.find({ project: record.inStock }),
      await this.contractModel.find({ project: record.outStock })
    )
    const outDate = moment(record.outDate)
    contracts.forEach(contract => {
      contract.calcs.forEach(async calc => {
        if (outDate < moment(calc.end)) {
          console.log(JSON.stringify(calc))
          await this.contractModel.updateOne({ _id: contract._id }, {
            $set: {
              "calcs.$[e].status": 'modified',
            }
          }, {
            arrayFilters: [
              {
                'e._id': calc._id,
              },
            ]
          })
        }
      })
    })
  }

  async calc(id: String, calc: any, user: User) {
    const contract = await this.findById(id)
    // 按添加时间 TODO
    const categories = ['租金', '非租', '装卸运费']
    const rules = {}
    categories.forEach(category => {
      const rule = _.find(_.reverse([...contract.items]),
        item => item.category === category && this.inRange(item.start, item.end, calc.start, calc.end))
      rules[category] = {
        fee: _.get(rule, 'plan'),
        weight: _.get(rule, 'weight'),
      }
    })
    if (!rules['租金']) {
      throw new Error('必须包含租金规则')
    }
    const rent = await this.storeService.calculate({
      startDate: new Date(calc.start),
      endDate: moment(calc.end).add(1, 'day').toDate(),
      rules: rules,
      user: user,
      project: contract.project,
    }) 
    calc.history = rent.history
    calc.list = rent.list
    calc.group = rent.group
    calc.nameGroup = rent.nameGroup
    calc.debug = rent.debug
    calc.status = 'latest'
    return calc;
  }

  async addCalc(id: String, calc: any, user: User) {
    const calcResult = await this.calc(id, calc, user)
    return this.contractModel.updateOne({ _id: id }, { $push: { calcs: calcResult } })
  }

  async restartCalc(id: String, calc: any, user: User) {

    return await this.contractModel.updateOne({ _id: id }, {
        $set: {
          "calcs.$[e]": await this.calc(id, calc, user),
        }
      }, {
        arrayFilters: [
          {
            'e._id': new Types.ObjectId(calc._id),
          },
        ]
      })
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

