import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Setting } from '../app.service';

@Injectable()
export class SettingsService {
  constructor(@InjectModel('Setting') private settingModel: Model<Setting>) { }

  async getLatestSettings() {
    const settings = await this.settingModel.findOne({}).sort({_id: -1})
    if (!settings) {
      // FIXME 要怎么兼容配置问题呢？
      return {}
    }
    return settings.toObject()
  }

  async update(body: Setting) {
    const settings = new this.settingModel(body)
    const savedSettings = await settings.save()
    return savedSettings
  }
}
