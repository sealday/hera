export const convertSubCount = datas => {
    const tempObject = (datas || []).reduce((currObject, item) => {
      const { name, size, total, projectId } = item
      const targetName = `${name}${size}${projectId}`
      if (currObject[targetName]) {
        const { total: currTotal, repeatNumber } = currObject[targetName]
        currObject[targetName] = {
          total: currTotal + total,
          repeatNumber: repeatNumber + 1,
        }
      } else {
        currObject[targetName] = {
          repeatNumber: 1,
          total,
        }
      }
      return currObject
    }, {})

    const tempNameArr = []
    const results = (datas || []).map(item => {
      const { name, size, projectId } = item
      const targetName = `${name}${size}${projectId}`

      // 标记是否第一行数据，以及统计该同名称规格的数据有多少行相同
      let isFirstRow = true
      if (tempNameArr.includes(targetName)) {
        isFirstRow = false
      } else {
        tempNameArr.push(targetName)
      }

      return {
        ...item,
        total: tempObject[targetName].total,
        isFirstRow,
        mergeRowNumber: tempObject[targetName].repeatNumber,
        isDetailSearch: true, // 特殊标价，标记是为明细查询的数据信息
      }
    })

  return results
}
