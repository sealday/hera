const getCountArr = (count, end) => {
  const resultArr = []
  for (let i = end + 1; i <= count; i++) {
    resultArr.push(i)
  }
  return resultArr
}

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

export const convertValues = values => {
  const { detailInfos = [], ...rest } = values
  const { entries, realinfos } = convertDetailInfos(detailInfos)
  return {
    ...rest,
    entries,
    realinfos,
  }
}
