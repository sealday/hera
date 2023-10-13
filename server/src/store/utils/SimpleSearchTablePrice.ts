import { each } from 'lodash'

/**
 * 购销数据计算合计金额方法
 * @param e 购销数据
 * @returns amount {String} 返回当前数据计算好的合计结果
 */

const SimpleSearchTablePrice = (e :any): String => {
  const entries = {}
  const total = {} // 数量和
  const totalUnit = {} // 单位
  const sum = {} // 金额
  let amount = 0 // 总金额

  if (e.length) {
    e.forEach(entry => {
      if (entry.name in entries) {
        entries[entry.name].push(entry)
        total[entry.name] += entry.subtotal
        totalUnit[entry.name] = entry.unit
        sum[entry.name] += entry.price ? entry.subtotal * entry.price : 0
      } else {
        entries[entry.name] = [entry]
        total[entry.name] = entry.subtotal
        totalUnit[entry.name] = entry.unit
        sum[entry.name] = entry.price ? entry.subtotal * entry.price : 0
      }
    })
    each(entries, (v, name) => {
      amount += sum[name] // 计算总金额
    })
    return amount.toFixed(2) === '0.00' ? '-' : amount.toFixed(2)
  }
}

export default SimpleSearchTablePrice