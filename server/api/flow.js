const helper = require('../utils/my').helper
const flowService = require('../service').flow

const finished = async (req, res) => {
    const records = await flowService.findFinished()
    res.json({
        data: {
            records
        } 
    })
}

const unfinished = async (req, res) => {
    const records = await flowService.findUnfinished()
    res.json({
        data: {
            records
        } 
    })
}

const confirm = async (req, res) => {
    const id = req.params.id
    await flowService.confirm(id)
    res.end()
}

const reject = async (req, res) => {
    const id = req.params.id
    await flowService.reject(id)
    res.end()
}

const cancel = async (req, res) => {
    const id = req.params.id
    await flowService.cancel(id)
    res.end()
}

exports.finished = helper(finished)
exports.unfinished = helper(unfinished)
exports.confirm = helper(confirm)
exports.reject = helper(reject)
exports.cancel = helper(cancel)
