const getCountArr = (count, end) => {
  const resultArr = []
  for (let i = end + 1; i <= count; i++) {
    resultArr.push(i)
  }
  return resultArr
}

// 保存后转换时，转换数据结构
export const convertDetailInfos = (detailInfos = []) => {
  const entries = []
  const realinfos = []

  for (let i = 0, count = 0; i < detailInfos.length; i++) {
    if (detailInfos[i]) {
      const {
        entries: itemEntries = [],
        realWeight,
        unit,
        comments,
      } = detailInfos[i]

      let curCount = count + itemEntries.length

      const realInfo = {
        realWeight,
        unit,
        comments,
        productGroups: getCountArr(curCount, count),
      }

      entries.push(...itemEntries)
      realinfos.push(realInfo)

      count = curCount
    }
  }

  return {
    entries,
    realinfos,
  }
}

// 编辑展示数据初始化展示时转换数据结构
export const convertRealValues = (initialValues = {}) => {
  const { entries, realinfos = [] } = initialValues
  const detailInfos = realinfos.map(item => {
    const { unit, realWeight, products, ...rest } = item
    const ids = products.map(({ id }) => id)
    const subEntries = ids.map(targetId => {
      const targetProduct = entries.find(({ _id }) => _id === targetId)
      return {
        ...targetProduct,
      }
    })
    return {
      ...rest,
      unit,
      realWeight,
      entries: subEntries,
    }
  })

  return {
    ...initialValues,
    detailInfos,
  }
}

export const convertValues = values => {
  const { detailInfos = [], ...rest } = values
  const { entries, realinfos } = convertDetailInfos(detailInfos)
  return {
    ...rest,
    entries,
    realinfos,
  }
}
