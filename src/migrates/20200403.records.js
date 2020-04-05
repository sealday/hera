// 更新流程状态
db.records.updateMany({ }, { $set: { flowStatus: 'finished' } })