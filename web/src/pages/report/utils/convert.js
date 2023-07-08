export const convertSubCount = datas => {
  const tempObject = (datas || []).reduce((currObject, item) => {
    const { name, size, total } = item
    const targetName = `${name}${size}`
    if (currObject[targetName]) {
      currObject[targetName] += total
    } else {
      currObject[targetName] = total
    }
    return currObject
  }, {})

  const results = (datas || []).map(item => {
    const { name, size } = item
    const targetName = `${name}${size}`

    return {
      ...item,
      total: tempObject[targetName],
    }
  })

  return results
}
