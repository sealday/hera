const Operation = require('../models').Operation
const diff = require('deep-diff').diff
const io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 })

class Logger {
  constructor () {
  }

  logRecordDiff(lhs, rhs, user) {
    lhs.inStock = lhs.inStock.toString()
    lhs.outStock = lhs.outStock.toString()
    rhs.inStock = rhs.inStock.toString()
    rhs.outStock = rhs.outStock.toString()
    const differences = diff(lhs, rhs)
    const report = {}
    const entryEdit = []
    const entryAdd = []
    const entryRemove = []
    const recordEdit = []
    differences.forEach(d => {
      // 记录条目编辑
      if (d.kind === 'E' && d.path[0] === 'entries') {
        entryEdit.push({
          old: lhs.entries[d.path[1]],
          new: rhs.entries[d.path[1]],
        })
      } else if (d.kind === 'A' && d.path[0] === 'entries') {
        if (d.item.kind === 'N') {
          entryAdd.push(d.item.rhs)
        } else if (d.item.kind === 'D') {
          entryRemove.push(d.item.lhs)
        }
      } else if (d.kind === 'N' || d.kind === 'E') {
        recordEdit.push({
          path: d.path,
          old: lhs[d.path[0]],
          new: rhs[d.path[0]],
        })
      }
    })
    report.entryEdit = entryEdit
    report.entryAdd = entryAdd
    report.entryRemove = entryRemove
    report.recordEdit = recordEdit
    report.user = user
    report.order = lhs.order
    const operation = new Operation({
      level: 'DANGER',
      timestamp: Date.now(),
      report: report,
    })
    io.emit('msg:danger', operation.toObject())
    operation.save().catch((err) => {
      console.error(err);
    })
  }
}

module.exports = Logger
