const diff = require('deep-diff').diff

class Logger {
  constructor () {
  }

  logRecordDiff(lhs, rhs, user) {
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
    report.datetime = new Date
    console.log(JSON.stringify(report, null, 4))
  }
}

module.exports = Logger
