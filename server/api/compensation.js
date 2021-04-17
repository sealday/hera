const planService = require('../service').plan
const helper = require('../utils/my').helper

const list = async (req, res) => {
  res.json({
    data: {
      repairPlans: await planService.findAll('compensation')
    }
  })
}

const create = async (req, res) => {
  await planService.create(req.body, 'compensation')
  res.end()
}

const deletePlan = async (req, res) => {
  const id = req.params.id
  await planService.remove(id)
  res.end()
}

const update = async (req, res) => {
  await planService.update(id, req.body)
  res.json({
    message: '更新成功'
  })
}

exports.list = helper(list)
exports.create = helper(create)
exports.delete = helper(deletePlan)
exports.update = helper(update)