import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/app/app.service';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class CompanyService {
  constructor(
    private storeService: StoreService,
    @InjectModel('Company') private companyModel: Model<Company>,
  ) { }

  async find() {
    return this.companyModel.find({ status: { '$ne': '已删除' }})
  }

  async findById(id: String) {
    return this.companyModel.findById(id)
  }

  async update(id: String, body: any) {
    return this.companyModel.updateOne({ _id: id }, { $set: body})
  }

  async delete(id: String) {
    return this.companyModel.deleteOne({ _id: id })
  }

  async create(body: Company) {
    const company = await new this.companyModel(body).save()
    return company
  }
}