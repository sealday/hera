const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Record = require('../models').Record

class FlowService {
    async findFinished() {
        return Record.find({ flowStatus: 'finished' }).sort({ _id: -1 }).limit(10)
    }

    async findUnfinished() {
        return Record.find({ flowStatus: 'reviewing' }).sort({ _id: -1 }).limit(10)
    }

    async confirm(id) {
        const res = await Record.updateOne({ _id: ObjectId(id) }, { flowStatus: 'finished' })
        return res.nModified
    }

    async reject() {
        const res = await Record.updateOne({ _id: ObjectId(id) }, { flowStatus: 'rejected' })
        return res.nModified
    }

    async cancel() {
        const res = await Record.updateOne({ _id: ObjectId(id) }, { flowStatus: 'cancelled' })
        return res.nModified
    }
}

module.exports = FlowService


