db.records.updateMany({ type: '采购' }, { $set: { type: '购销' } })
db.records.updateMany({ type: '销售' }, { $set: { type: '购销' } })
db.records.updateMany({ type: '盘点入库' }, { $set: { type: '盘点' } })
db.records.updateMany({ type: '盘点出库' }, { $set: { type: '盘点' } })
