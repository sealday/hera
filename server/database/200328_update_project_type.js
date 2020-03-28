db.projects.updateMany({ type: '项目部仓库' }, { $set: { type: '项目仓库' } })
db.projects.updateMany({ type: '租赁仓库' }, { $set: { type: '租赁客户' } })
db.projects.updateMany({ type: '第三方仓库' }, { $set: { type: '同行客户' } })
