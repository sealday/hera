const Operation = require('../models/operation')
const ObjectId = require('mongoose').Types.ObjectId
const uid = require('uid-safe').sync
const home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];

exports.topK = (req, res) => {
    Operation.find().sort({ _id: -1 }).limit(10).then(operations => {
        res.json({
            message: '加载成功',
            data: {
                operations
            }
        })
    }).catch(err => {
        next(err);
    })
}

exports.nextK = (req, res) => {
    const query = req.query
    const id = ObjectId(query.id)
    Operation.find({ _id: { $lt: id }}).sort({ _id: -1 }).limit(10).then(operations => {
        res.json({
            message: '加载成功',
            data: {
                operations
            }
        })
    }).catch(err => {
        next(err)
    })
}
