import { each } from "lodash"
import moment from "moment"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { IfShow } from "../../components"
import {
  toFixedWithoutTrailingZero as fixed,
  total_,
  getUnit,
} from '../../utils'

// 表格内容
const PrintContent = ({ record, columnStyle, selectedTitle }) => {
  const store = useSelector(state => state.system.store)
  const projects = useSelector(state => state.system.projects)
  const config = useSelector(state => state.system.config)
  const products = useSelector(state => state.system.products)
  const articles = useSelector(state => state.system.articles.toArray())
  const [orderTitle, setOrderTitle] = useState(config.externalNames[0])
  const content = {
    orderName: record.type + '单',
    partA: '',
    partB: '',
    partALabel: '出库方',
    partBLabel: '入库方',
    outLabel: '出库方',
    inLabel: '入库方',
    signer: '入库方',
    project: '', // 用于
  }
  if (record.outStock) {
    content.partA = projects.get(record.outStock).company + projects.get(record.outStock).name
  }
  if (record.inStock) {
    content.partB = projects.get(record.inStock).company + projects.get(record.inStock).name
  }

  // 出入库判断
  // TODO 对于采购单，如果出现直接采购送往对应项目，那么单据的内容标签是否不合适
  if (record.type !== '盘点') {
    if (record.inStock === store._id) {
      content.project = projects.get(record.outStock)
      content.orderName = '入库单'
      content.signer = '出库方'
      content.partALabel = '出库方'
      content.partBLabel = '入库方'
      if (record.type === '购销') {
        content.partALabel = '销售单位'
        content.partBLabel = '采购单位'
        content.signer = '销售方'
      }
      content.partA = projects.get(record.outStock).company + projects.get(record.outStock).name
      content.partB = projects.get(record.inStock).company + projects.get(record.inStock).name
    } else if (record.outStock === store._id) {
      content.project = projects.get(record.inStock)
      content.orderName = '出库单'
      content.signer = '入库方'
      content.partALabel = '入库方'
      content.partBLabel = '出库方'
      if (record.type === '购销') {
        content.partALabel = '采购单位'
        content.partBLabel = '销售单位'
        content.signer = '采购方'
      }
      content.partA = projects.get(record.inStock).company + projects.get(record.inStock).name
      content.partB = projects.get(record.outStock).company + projects.get(record.outStock).name
    }
  }

  // 关联公司来确认标题名称
  useEffect(() => {
    if (content.project.associatedCompany) {
      setOrderTitle(content.project.associatedCompany)
    }
  }, [content.project.associatedCompany])

  // 计算打印内容
  const entries = {}
  const total = {} // 数量和
  const sum = {} // 金额
  let amount = 0 // 总金额
  record.entries.forEach(entry => {
    const result = total_(entry, products)
    if (entry.name in entries) {
      entries[entry.name].push(entry)
      total[entry.name] += result
      sum[entry.name] += entry.price ? result * entry.price : 0
    } else {
      entries[entry.name] = [entry]
      total[entry.name] = result
      sum[entry.name] = entry.price ? result * entry.price : 0
    }
  })
  const productTypeMap = {}
  articles.forEach(article => {
    productTypeMap[article.name] = article
  })
  const printEntries = []
  each(entries, (v, name) => {
    printEntries.push(...entries[name].map(entry => [
      entry.name,
      entry.size,
      entry.count + ' ' + productTypeMap[name].countUnit,
      fixed(total_(entry, products)) + getUnit(productTypeMap[name]),
      entry.price ? '￥' + entry.price : '',
      entry.price ? '￥' + fixed(total_(entry, products) * entry.price) : '',
      entry.comments,
    ]))
    amount += sum[name] // 计算总金额
    printEntries.push(
      [
        name,
        '',
        '',
        fixed(total[name]) + ' ' + getUnit(productTypeMap[name]),
        '',
        '￥' + fixed(sum[name]),
        '',
      ]
    )
  })
  printEntries.push(['', '', '', '', '总金额', '￥' + fixed(amount), ''])
  const rows = []
  if (columnStyle === 'double') {
    if (printEntries.length % 2 !== 0) {
      printEntries.push(['', '', '', '', '', '', ''])
    }
    const half = printEntries.length / 2
    for (let i = 0; i < half; i++) {
      rows.push(printEntries[i].concat(printEntries[i + half]))
    }
  } else {
    const length = printEntries.length
    for (let i = 0; i < length; i++) {
      rows.push(printEntries[i])
    }
  }
  // 标题数量，单栏一倍，双栏两倍
  const columnNames = ['名称', '规格', '数量', '小计', '单价', '金额', '备注']
  if (columnStyle === 'double') {
    columnNames.push(...columnNames)
  }
  return (
    <div style={{ position: 'relative', paddingRight: '1.2em', minHeight: '30em' }}>
      <div style={{
        position: 'absolute',
        top: '6.5em',
        fontSize: '9px',
        right: 0,
        width: '1.2em'
      }}>①发货方存根②收货方存根③承运方存根</div>
      <h4 className="text-center">{selectedTitle ? selectedTitle: orderTitle}</h4>
      <h4 className="text-center">{content.orderName}</h4>
      <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
        <colgroup>
          <col style={{ width: '50%' }} />
        </colgroup>
        <tbody>
          <tr>
            <td><IfShow cond={content.partA}>{content.partALabel}：{content.partA}</IfShow></td>
            <td>日期：{moment(record.outDate).format('YYYY-MM-DD')}</td>
            <td>流水号：{record.number}</td>
          </tr>
          <tr>
            <td><IfShow cond={content.partB}>{content.partBLabel}：{content.partB}</IfShow></td>
            <td>车号：{record.carNumber}</td>
            <td>原始单号：{record.originalOrder}</td>
          </tr>
        </tbody>
      </table>
      <table className="table table-bordered table--tight" style={{
        tableLayout: 'fixed',
        fontSize: '9px',
        marginBottom: '0',
        width: '100%',
      }}>
        <thead>
          <tr>
            {columnNames.map((name, index) => (
              <th key={index}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr className="text-right" key={index}>
              {row.map((col, index) => (
                <td key={index}>{col}</td>
              ))}
            </tr>
          ))}
          <tr>
            <td colSpan={columnStyle === 'single' ? 4 : 7} >
              <span>说明：如供需双方未签正式合同，本{content.orderName}经供需双方代表签字确认后，将作为合同</span>
              <span>及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。{content.signer}须核对</span>
              <span>以上产品规格、数量确认后可签字认可。</span>
            </td>
            <td colSpan={columnStyle === 'single' ? 3 : 7}>
              备注 {record.comments}
            </td>
          </tr>
        </tbody>
      </table>
      <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
        <tbody>
          <tr>
            <td>制单人：{record.username}</td>
            <td><IfShow cond={record.type !== '盘点' || !!record.outStock}>{content.outLabel}（签名）：</IfShow></td>
            <td><IfShow cond={record.type !== '盘点' || !!record.inStock}>{content.inLabel}（签名）：</IfShow></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PrintContent