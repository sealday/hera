import _ from 'lodash'
import { each } from "lodash"
import moment from "moment"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import heraApi from '../../api'
import { Error, IfShow, Loading, RefCascaderLabel } from "../../components"
import { PROJECT_STATUS_MAP } from '../../constants'
import {
  toFixedWithoutTrailingZero as fixed,
  total_,
  getUnit,
  makeKeyFromNameSize,
} from '../../utils'

// 表格内容
const PrintContent = ({ record, columnStyle, selectedTitle }) => {
  const contracts = heraApi.useGetContractListQuery()
  const getOtherList = heraApi.useGetOtherListQuery()
  const store = useSelector(state => state.system.store)
  const projects = useSelector(state => state.system.rawProjects)
  const config = useSelector(state => state.system.config)
  const products = useSelector(state => state.system.products)
  const articles = useSelector(state => state.system.articles.valueSeq().toArray())
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
    explain: '',
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
  } else {
    content.partBLabel = '盘点仓库'
    content.inLabel = '盘点负责人'
    content.signer = '盘点负责人'
  }

  // 租赁单
  if (record.type === '调拨') {
    content.partALabel = '承租单位'
    content.partBLabel = '工程项目'
    if (record.inStock === store._id) {
      const project = projects.get(record.outStock)
      content.partA = project.company
      content.partB = project.name
    } else if (record.outStock === store._id) {
      const project = projects.get(record.inStock)
      content.partA = project.company
      content.partB = project.name
    } else {
      // FIXME 两个都不是关联公司的话，暂定为入库
      const project = projects.get(record.inStock)
      content.partA = project.company
      content.partB = project.name
    }
    content.outLabel = '出租单位'
    content.inLabel = '租借单位'
  }

  const isRent = () => record.type === '调拨'
  const getProject = () => record.inStock === store._id
    ? projects.get(record.outStock)
    : projects.get(record.inStock)
  const getContract = () => {
    const project = getProject()
    return contracts.data.find(item => item.project === project._id)
  }
  

  content.explain = `说明：如供需双方未签正式合同，本${content.orderName}经供需双方代表签字确认后，
  将作为合同及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。${content.signer}须核对
  以上产品规格、数量确认后可签字认可。`

  if (record.type === '盘点') {
    content.explain = '说明：盘点单用于清算仓库盈亏盈余。'
  }


  // 关联公司来确认标题名称
  useEffect(() => {
    if (content.project.associatedCompany) {
      setOrderTitle(content.project.associatedCompany)
    }
  }, [content.project.associatedCompany])

  if (contracts.isError || getOtherList.isError) {
    return <Error />
  }
  if (contracts.isLoading || getOtherList.isLoading) {
    return <Loading />
  }
  
  // 补充信息处理
  const associatedMap = {}
  const unconnected = []
  record.complements.forEach(item => {
    if (item.level === 'associated') {
      const associate = item.associate
      const key = `${associate.type}|${associate.name}|${associate.size}`
      if (_.isUndefined(associatedMap[key])) {
        associatedMap[key] = []
      }
      associatedMap[key].push(item)
    } else {
      unconnected.push(item)
    }
  })

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
  const productItem = {
    name: 'product',
    label: '项目',
    type: 'text',
    option: {
      type: 'ref',
      ref: 'other',
      label: 'name',
      value: 'id',
      select: 'cascader',
    },
    name: 'count',
    label: '数量',
    type: 'text',
  }
  const printEntries = []
  each(entries, (v, name) => {
    entries[name].forEach(entry => {
      printEntries.push([
        { colSpan: 2, children: entry.name + '[' + entry.size + ']'},
        { hidden: true, children: '' },
        entry.count + ' ' + productTypeMap[name].countUnit,
        fixed(total_(entry, products)) + getUnit(productTypeMap[name]),
        entry.price ? '￥' + entry.price : '',
        entry.price ? '￥' + fixed(total_(entry, products) * entry.price) : '',
        entry.comments,
      ])
      if (associatedMap[`${entry.type}|${entry.name}|${entry.size}`]) {
        associatedMap[`${entry.type}|${entry.name}|${entry.size}`].forEach(item => {
          const product = _.find(getOtherList.data, other => other.id === _.last(item.product))
          const associatedLabel = {
            colSpan: 2,
            children: _.get(product, 'display', <RefCascaderLabel item={productItem} value={item.product} />)
          }
          if (_.get(product, 'isAssociated')) {
            const associatedEntry =
              [
                associatedLabel,
                item.count + ' ' + productTypeMap[entry.name].countUnit,
                fixed(total_({ ...entry, count: item.count }, products)) + getUnit(productTypeMap[name]),
                { hidden: true, children: '' },
                '',
                '',
                item.comments,
              ]
            printEntries.push(associatedEntry)
          } else {
            const associatedEntry =
              [
                associatedLabel,
                item.count + ' ' + product.unit,
                '',
                { hidden: true, children: '' },
                '',
                '',
                item.comments,
              ]
            printEntries.push(associatedEntry)
          }
        })
      }
    })
    amount += sum[name] // 计算总金额
    printEntries.push(
      [
        { colSpan: 2, children: name + '[小计]' },
        { hidden: true, children: '' },
        { hidden: true, children: '' },
        { colSpan: 2, children: fixed(total[name]) + ' ' + getUnit(productTypeMap[name]) },
        '',
        '￥' + fixed(sum[name]),
        '',
      ]
    )
  })
  // 补充
  unconnected.forEach(item => {
    const product = _.find(getOtherList.data, other => other.id === _.last(item.product))
    const associatedLabel = {
      colSpan: 2,
      children: _.get(product, 'display', <RefCascaderLabel item={productItem} value={item.product} />) 
    }
    const associatedEntry =
      [
         associatedLabel,
        item.count + ' ' + product.unit,
        '',
        { hidden: true, children: '' },
        '',
        '',
        item.comments,
      ]
    printEntries.push(associatedEntry)
  })

  let slice = 5
  let leftSlice = 3
  let ignoreIndexes = [4, 5, 11, 12]
  if (record.type === '购销') {
    printEntries.push(['', '', '', '', '总金额', '￥' + fixed(amount), ''])
    slice += 2
    leftSlice += 1
    ignoreIndexes = []
  }
  const rows = []
  if (columnStyle === 'double') {
    leftSlice = slice
    slice *= 2
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
  const columnNames = [{ children: '产品', colSpan: 2 }, { children: '', hidden: true }, '数量', '小计', '单价', '金额', '备注']
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
        {
          isRent()
            ?
            <colgroup>
              <col style={{ width: '25%' }} />
              <col style={{ width: '55%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            :
            <colgroup>
              <col style={{ width: '50%' }} />
            </colgroup>
        }
        <tbody>
          {isRent() 
          ? (
              <>
                <tr>
                  <td>客户号：{getProject().code}</td>
                  <td><IfShow cond={content.partA}>承租单位：{content.partA}</IfShow></td>
                  <td>日期：{moment(record.outDate).format('YYYY-MM-DD')}</td>
                </tr>
                <tr>
                  <td>合同编号：{_.get(getContract(), 'code', '')}</td>
                  <td><IfShow cond={content.partB}>项目名称：{content.partB}</IfShow></td>
                  <td>流水号：{record.number}</td>
                </tr>
                <tr>
                  <td>状态：{_.get(getContract(), 'status', PROJECT_STATUS_MAP[getProject().status])}</td>
                  <td>项目地址：{getProject().address}</td>
                  <td>原始单号：{record.originalOrder}</td>
                </tr>
                <tr>
                  <td>经办人及电话：</td>
                  <td>项目联系人电话：{getProject().contacts.map(user => user.name + ' ' + user.phone).join(' ')}</td>
                  <td>车号：{record.carNumber}</td>
                </tr>
              </>
          )
            : (
              <>
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
              </>
            )
          }
        </tbody>
      </table>
      <table className="table table-bordered table--tight" style={{
        tableLayout: 'fixed',
        fontSize: '11px',
        marginBottom: '0',
        width: '100%',
      }}>
        <thead>
          <tr>
            {columnNames
              .filter((_name, index) => !ignoreIndexes.includes(index))
              .map((col, index) => (
                <th key={index}
                  style={_.get(col, 'hidden', false) ? { display: 'none' } : {}}
                  colSpan={_.get(col, 'colSpan', 1)}>{_.get(col, 'children', col)}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr className="text-right" key={index}>
              {row
                .filter((_name, index) => !ignoreIndexes.includes(index))
                .map((col, index) => (
                  <td
                    key={index}
                    style={_.get(col, 'hidden', false) ? { display: 'none' } : {}}
                    colSpan={_.get(col, 'colSpan', 1)}>
                    {_.get(col, 'children', col)}
                  </td>
                ))}
            </tr>
          ))}
          <tr>
            <td colSpan={leftSlice} >
              {content.explain}
            </td>
            <td colSpan={slice - leftSlice}>
              备注：{record.comments} 
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