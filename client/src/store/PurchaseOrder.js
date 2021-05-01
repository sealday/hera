import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router'
import { Button, PageHeader, Card, Menu, Dropdown, Radio } from 'antd'

import {
  toFixedWithoutTrailingZero as fixed,
  total_,
  isUpdatable,
  getUnit,
  RECORD_TYPE2URL_PART,
} from '../utils'
import PrintFrame from '../components/PrintFrame'

const PurchaseOrder = ({ record, router }) => {
  const store = useSelector(state => state.system.store)
  const projects = useSelector(state => state.system.projects)
  const imArticles = useSelector(state => state.system.articles)
  const user = useSelector(state => state.system.user)
  const products = useSelector(state => state.system.products)
  const config = useSelector(state => state.system.config)
  const [printCompany, setPrintCompany] = useState(config.externalNames[0])
  const [columnStyle, setColumnStyle] = useState('single')

  const printFrame = React.createRef()

  const handleTransport = () => {
    router.push(`/transport/${record._id}`)
  }
  const articles = imArticles.toArray()

  let orderName = ''
  let company = ''
  let companyLabel = '承租单位'
  let name = ''
  let nameLabel = '工程项目'
  let direction = ''

  let outLabel = '出租单位'
  let inLabel = '租借单位'

  let signer = '租用方'
  let project = null

  // 判断是收料单还是发料单
  if (record.inStock === store._id) {
    // 入库是当前操作仓库时，是入库单
    orderName = '收料单'
    direction = 'in'
    project = projects.get(record.outStock)
    if (record.type === '调拨') {
      company = projects.get(record.outStock).company
      name = projects.get(record.outStock).name
    } else if (record.type === '购销') {
      orderName = '采购入库单'
      outLabel = '销售单位'
      inLabel = '采购单位'
      companyLabel = '销售单位'
      company = projects.get(record.outStock).company + projects.get(record.outStock).name
      nameLabel = '采购单位'
      signer = '销售方'
      name = projects.get(record.inStock).company + projects.get(record.inStock).name
    } else if (record.type === '暂存') {
      orderName = '暂存入库单'
      outLabel = '出库单位'
      inLabel = '入库单位'
      companyLabel = '出库单位'
      company = projects.get(record.outStock).company + projects.get(record.outStock).name
      nameLabel = '入库单位'
      signer = '出库方'
      name = projects.get(record.inStock).company + projects.get(record.inStock).name
    }
  } else if (record.outStock === store._id) {
    // 出库是当前操作仓库时，是出库单
    orderName = '出库单'
    direction = 'out'
    project = projects.get(record.inStock)
    if (record.type === '调拨') {
      company = projects.get(record.inStock).company
      name = projects.get(record.inStock).name
    } else if (record.type === '购销') {
      orderName = '销售出库单'
      outLabel = '销售单位'
      inLabel = '采购单位'
      companyLabel = '采购单位'
      company = projects.get(record.inStock).company + projects.get(record.inStock).name
      nameLabel = '销售单位'
      signer = '采购方'
      name = projects.get(record.outStock).company + projects.get(record.outStock).name
    } else if (record.type === '暂存') {
      orderName = '暂存出库单'
      outLabel = '出库单位'
      inLabel = '入库单位'
      companyLabel = '出库单位'
      company = projects.get(record.inStock).company + projects.get(record.inStock).name
      nameLabel = '入库单位'
      signer = '入库方'
      name = projects.get(record.outStock).company + projects.get(record.outStock).name
    }
  } 

  useEffect(() => {
    if (project.associatedCompany) {
      setPrintCompany(project.associatedCompany)
    }
  }, [project.associatedCompany])

  if (!project) {
    return <div>非法访问</div>
  }

  let entries = {}
  let total = {} // 数量和
  let sum = {} // 金额
  let amount = 0 // 总金额
  record.entries.forEach(entry => {
    let result = total_(entry, products)

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

  let productTypeMap = {}
  articles.forEach(article => {
    productTypeMap[article.name] = article
  })

  let printEntries = []
  for (let name in entries) {
    /*eslint guard-for-in: off*/
    printEntries = printEntries.concat(entries[name].map(entry => [
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
  }

  printEntries.push(['', '', '', '', '总金额', '￥' + fixed(amount), ''])

  let rows = []
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
  let columnNames = ['名称', '规格', '数量', '小计', '单价', '金额', '备注']
  if (columnStyle === 'double') {
    columnNames = columnNames.concat(columnNames)
  }

  // 表格内容
  const PrintContent = () => <div style={{ position: 'relative', paddingRight: '1.2em', minHeight: '30em' }}>
    <div style={{
      position: 'absolute',
      top: '6.5em',
      fontSize: '9px',
      right: 0,
      width: '1.2em'
    }}>①发货方存根②收货方存根③承运方存根</div>
    <h4 className="text-center">{printCompany}</h4>
    <h4 className="text-center">{orderName}</h4>
    <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
      <colgroup>
        <col style={{ width: '50%' }} />
      </colgroup>
      <tbody>
        <tr>
          <td>{companyLabel}：{company}</td>
          <td>日期：{moment(record.outDate).format('YYYY-MM-DD')}</td>
          <td>流水号：{record.number}</td>
        </tr>
        <tr>
          <td>{nameLabel}：{name}</td>
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
            <span>说明：如供需双方未签正式合同，本{orderName}经供需双方代表签字确认后，将作为合同</span>
            <span>及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。{signer}须核对</span>
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
          <td>{outLabel}（签名）：</td>
          <td>{inLabel}（签名）：</td>
        </tr>
      </tbody>
    </table>
  </div>

  const onMenuClick = name => () => {
    setPrintCompany(name)
  }
  const menu = (
    <Menu>
      {config.externalNames.map(name => <Menu.Item key={name} onClick={onMenuClick(name)}>{name}</Menu.Item>)}
    </Menu>
  )
  const options = [
    { label: '单栏', value: 'single' },
    { label: '双栏', value: 'double' },
  ]
  return <>
    <PageHeader
      title="打印预览"
      ghost={false}
      extra={[
        <Button key={1} onClick={() => router.goBack()}>返回</Button>,
        <Dropdown key={3} overlay={menu} trigger={['click']} key={2}><Button>切换打印用公司</Button></Dropdown>,
        isUpdatable(store, user) && record.type in RECORD_TYPE2URL_PART && <>
          <Link key={5} to={`/${RECORD_TYPE2URL_PART[record.type]}/${direction}/${record._id}/edit`}><Button>编辑</Button></Link>
        </>,
        <Button key={2} onClick={handleTransport}>运输单</Button>,
        <Button key={4} type="primary" onClick={() => printFrame.current.print()}>打印</Button>,
      ]}
    />
    <div style={{ height: '8px' }}></div>
    <Card
      extra={<Radio.Group options={options} onChange={e => setColumnStyle(e.target.value)} value={columnStyle} optionType="button" buttonStyle="outline" />}
    >
      <PrintFrame ref={printFrame}>
        <PrintContent />
      </PrintFrame>
      </Card>
  </>
}

export default PurchaseOrder
