const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment')
const _ = require('lodash')

const helper = require('../utils/my').helper
const Setting = require('../models').Setting

const update = async (req, res) => {
  const body = _.omit(req.body, ['_id'])
  let settings = new Setting(body)

  const savedSettings = await settings.save()
  res.json({
    message: '保存配置成功，如需马上生效请刷新浏览器！',
    data: {
      settings: savedSettings,
    }
  })
}

exports.update = helper(update)
