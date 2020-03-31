const Logger = require('./Logger')
const Recycle = require('./Recycle')
const Plan = require('./Plan')
const Store = require('./Store')
const Record = require('./Record')

exports.num = 0
exports.io = null
exports.sockets = []
exports.stock = {} // { ObjectId: { valid, inRecords, outRecords} }
exports.socketMap = new Map;

exports.root = null // 项目根路径，由 app 文件设置

exports.logger = new Logger
exports.recycle = new Recycle
exports.plan = new Plan
exports.store = new Store
exports.record = new Record
