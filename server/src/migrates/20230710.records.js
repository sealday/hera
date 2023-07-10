// 处理分组数据兼容性
const records = db.records.find().toArray()

records.forEach(record => {
  if (record.realinfos && record.realinfos.length > 0) {
    console.log('new record')
  } else {
    const productGroups = []
    for (let i = 0; i < record.entries.length; i++) {
        productGroups.push(i + 1)
    }
    db.records.updateOne(
      { _id: record._id },
      {
        $set: {
          realinfos: [
            {
              productGroups: productGroups,
              unit: '吨',
              realWeight: record.weight,
              _id: new ObjectId(),
            },
          ],
        },
      }
    )
    console.log('old record')
  }
})
