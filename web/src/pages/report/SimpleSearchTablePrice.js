import { useGetRecordQuery } from '../../api'
import { toFixedWithoutTrailingZero as fixed } from '../../utils'
import { each } from 'lodash'

export default ({ id }) => {
  const e = useGetRecordQuery(id)
  const entries = {}
  const total = {} // 数量和
  const totalUnit = {} // 单位
  const sum = {} // 金额
  let amount = 0 // 总金额

  if (e.data) {
    e.data.entries.forEach(entry => {
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
    const printEntries = []
    each(entries, (v, name) => {
      entries[name].forEach(entry => {
        printEntries.push([
          { colSpan: 2, children: entry.name + '[' + entry.size + ']' },
          { hidden: true, children: '' },
          // entry.count + ' ' + productTypeMap[name].countUnit,
          fixed(entry.subtotal) + ' ' + entry.unit,
          entry.price ? '￥' + entry.price : '',
          entry.price ? '￥' + fixed(entry.subtotal * entry.price) : '',
          entry.comments,
        ])
      })
      amount += sum[name] // 计算总金额
    })
  }

  return <>{amount.toFixed(2) === '0.00' ? '-' : amount.toFixed(2)}</>
}
