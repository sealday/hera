import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Other, OtherDocument} from 'src/schemas/other.schema';

@Injectable()
export class OtherService {
  constructor(@InjectModel(Other.name) private otherModel: Model<OtherDocument>) { }

  async create(other: Other) {
    return await (await this.otherModel.create(other)).save()
  }

  async findAll() {
    return await this.otherModel.find()
  }

  async findOne(id: string) {
    return await this.otherModel.findById(id)
  }

  async update(id: string, other: Other) {
    console.log(other)
    return await this.otherModel.findByIdAndUpdate(id, { $set: other })
  }

  async remove(id: string) {
    return await this.otherModel.findByIdAndDelete(id)
  }
}