const Operation = require('../models').Operation
const diff = require('deep-diff').diff
const _ = require('lodash')

class Logger {
  constructor () {
  }

  logRecordDiff(lhs, rhs, user) {
    lhs.inStock = lhs.inStock && lhs.inStock.toString()
    lhs.outStock = lhs.outStock && lhs.outStock.toString()
    rhs.inStock = rhs.inStock && rhs.inStock.toString()
    rhs.outStock = rhs.outStock && rhs.outStock.toString()
    const recordFields = new Set(['outStock', 'inStock', 'vendor', 'originalOrder', 'carNumber', 'fee', 'comments'])
    const differences = diff(_.omit(lhs, ['entries']), _.omit(rhs, ['entries']))
    const report = {}
    const recordEdit = []
    const entryEdit = []
    const entryAdd = []
    const entryRemove = []
    const leftEntries = {}
    const rightEntries = {}
    _.forEach(lhs.entries, (entry) => {
      leftEntries[_.toString(entry._id)] = entry
    })
    _.forEach(rhs.entries, (entry) => {
      rightEntries[_.toString(entry._id)] = entry
    })
    _.forEach(diff(leftEntries, rightEntries), d => {
      if (d.kind === 'N') {
        entryAdd.push({
          field: d.path[0],
          new: d.rhs,
        })
      } else if (d.kind === 'D') {
        entryRemove.push({
          field: d.path[0],
          old: d.lhs,
        })
      } else if (d.kind === 'E') {
        entryEdit.push({
          field: d.path[0],
          old: leftEntries[d.path[0]],
          new: rightEntries[d.path[0]],
        })
      }
    })
    _.forEach(differences, d => {
      if (d.kind === 'N' || d.kind === 'E') {
        if (recordFields.has(d.path[0])) {
          recordFields.delete(d.path[0])
          if (d.path[0] === 'fee') {
            const old = lhs[d.path[0]]
            const newOne = rhs[d.path[0]]
            _.forEach(['car', 'sort', 'other1', 'other2'], name => {
              if (_.get(old, name) || _.get(newOne, name)) {
                recordEdit.push({
                  field: name + 'Fee',
                  old: _.get(old, name),
                  new: _.get(newOne, name),
                })
              }
            })
          } else {
            recordEdit.push({
              field: d.path[0],
              old: lhs[d.path[0]],
              new: rhs[d.path[0]],
            })
          }
        }
      }
    })
    report.entryEdit = _.uniqBy(entryEdit, e => e.field)
    report.entryAdd = entryAdd
    report.entryRemove = entryRemove
    report.recordEdit = recordEdit
    report.order = lhs.order
    report.number = lhs.number
    report.type = lhs.type
    const operation = new Operation({
      level: 'DANGER',
      timestamp: Date.now(),
      user: _.pick(user, ['username', 'profile.name']),
      report: report,
    })
    operation.save().catch((err) => {
      console.error(err);
    })
  }
}

module.exports = Logger
