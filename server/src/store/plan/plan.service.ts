import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Price, Plan } from 'src/app/app.service';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel('Price') private priceModel: Model<Price>,
    @InjectModel('Plan') private planModel: Model<Plan>,
  ) { }

  async find(type: string) {
    if (type === 'price') {
      return this.priceModel.find()
    } else {
      return this.planModel.find({ type })
    }
  }

  async findById(id: string) {
    const pricePlan = await this.priceModel.findById(id)
    if (pricePlan) {
      return pricePlan
    }
    const plan = await this.planModel.findById(id)
    return plan
  }

  async create(type: string, body: any) {
    if (type === 'price') {
      return (new this.priceModel(body)).save()
    } else {
      return (new this.planModel({ ...body, type })).save()
    }
  }

  async remove(type: string, planId: string) {
    if (type === 'price') {
      return this.priceModel.findByIdAndDelete(planId)
    } else {
      return this.planModel.findByIdAndDelete(planId)
    }
  }

  async update(type: string, planId: string, body: any) {
    if (type === 'price') {
      const plan = await this.priceModel.findById(planId)
      Object.assign(plan, body)
      return plan.save()
    } else {
      const plan = await this.planModel.findById(planId)
      Object.assign(plan, body)
      return plan.save()
    }
  }
}