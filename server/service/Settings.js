const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment')
const _ = require('lodash')

const Setting = require('../models').Setting
const config = require('../../config')

class Settings {
  async getLatestSettings() {
    const settings = await Setting.findOne({}).sort({_id: -1})
    if (!settings) {
      // FIXME 要怎么兼容配置问题呢？
      return {}
    }
    return settings.toObject()
  }
}


module.exports = new Settings()
