import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Store } from './app.service';

@Injectable()
export class StoreService {
  constructor(@InjectModel('Store') private storeModel: Model<Store>) { }

  async put(key: String, value: String) {
    return await new this.storeModel({ key, value }).save()
  }

  async get(key: String) {
    return await this.storeModel.findOne({ key })
  }

}
