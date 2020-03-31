const _ = require('lodash')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const Record = require('../models').Record

class RecordService {
    async delete(recordId) {
        const res = await Record.updateOne({ _id: ObjectId(recordId) }, { valid: false })
        return res.nModified
    }
    async recover() {
        const res = await Record.updateOne({ _id: ObjectId(recordId) }, { valid: true })
        return res.nModified
    }
}

module.exports = RecordService