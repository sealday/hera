export const simplifyString = str => {
  const strArr = [...str.join('')]
  const simplifyStr = strArr
    .slice(0, 4)
    .concat(['...'])
    .concat(strArr.slice(-3))
  return simplifyStr.join('')
}
