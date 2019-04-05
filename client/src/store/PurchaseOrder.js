import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@material-ui/core'
import {
  unstable_useMediaQuery as useMediaQuery,
} from '@material-ui/core/useMediaQuery'

import { toFixedWithoutTrailingZero as fixed, total_, isUpdatable, getUnit } from '../utils'

class PurchaseOrder extends React.Component {

  state = {
    columnStyle: 'single', // 栏目样式，支持单栏和双栏
  }

  handleTransport = () => {
    const { router, record } = this.props
    router.push(`/transport/${record._id}`)
  }

  render() {
    const { record, store, projects, articles, router, user, printCompany } = this.props

    let orderName = ''
    let company = ''
    let companyLabel = '承租单位'
    let name = ''
    let nameLabel = '工程项目'
    let direction = ''

    let outLabel = '出租单位'
    let inLabel = '租借单位'

    let signer = '租用方'

    // 判断是收料单还是发料单
    if (record.inStock === store._id) {
      // 入库是当前操作仓库时，是入库单
      orderName = '收料单'
      direction = 'in'
      if (record.type === '调拨') {
        company = projects.get(record.outStock).company
        name = projects.get(record.outStock).name
      } else if (record.type === '采购') {
        orderName = '采购入库单'
        outLabel = '出售单位'
        inLabel = '采购项目'
        companyLabel = '出售单位'
        company = projects.get(record.outStock).company + projects.get(record.outStock).name
        nameLabel = '采购项目'
        signer = '出售方'
        name = projects.get(record.inStock).company + projects.get(record.inStock).name
      }
    } else if (record.outStock === store._id) {
      // 出库是当前操作仓库时，是出库单
      orderName = '出库单'
      direction = 'out'
      if (record.type === '调拨') {
        company = projects.get(record.inStock).company
        name = projects.get(record.inStock).name
      } else if (record.type === '销售') {
        orderName = '销售出库单'
        outLabel = '出售项目'
        inLabel = '采购单位'
        companyLabel = '采购单位'
        company = projects.get(record.inStock).company + projects.get(record.inStock).name
        nameLabel = '出售项目'
        signer = '采购方'
        name = projects.get(record.outStock).company + projects.get(record.outStock).name
      }
    } else {
      // FIXME 当两者都不是的时候，属于非法访问
      return <div>非法访问</div>
    }

    let entries = {}
    let total = {} // 数量和
    let sum = {} // 金额
    let amount = 0 // 总金额
    record.entries.forEach(entry => {
      let result = total_(entry, this.props.products)

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
        fixed(total_(entry, this.props.products)) + getUnit(productTypeMap[name]),
        entry.price ? '￥' + entry.price : '',
        entry.price ? '￥' + fixed(total_(entry, this.props.products) * entry.price) : '',
        entry.comments,
      ]))

      amount += sum[name] // 计算总金额

      printEntries.push(
        [
          name,
          '',
          '',
          fixed(total[name])  + ' ' + getUnit(productTypeMap[name]),
          '',
          '￥' + fixed(sum[name]),
          '',
        ]
      )
    }

    printEntries.push(['', '', '', '', '总金额', '￥' + fixed(amount), ''])

    if (printEntries.length % 2 !== 0) {
      printEntries.push(['', '', '', '', '', '', ''])
    }

    let rows = []
    if (this.state.columnStyle === 'double') {
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
    if (this.state.columnStyle === 'double') {
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
      <table style={{tableLayout: 'fixed', fontSize: '11px', width: '100%'}}>
        <colgroup>
          <col style={{width: '50%'}}/>
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
      <table className="table table-bordered table--tight" style={{tableLayout: 'fixed', fontSize: '9px', marginBottom: '0'}}>
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
          <td colSpan={this.state.columnStyle === 'single' ? 4 : 7} >
            <span>说明：如供需双方未签正式合同，本{orderName}经供需双方代表签字确认后，将作为合同</span>
            <span>及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。{signer}须核对</span>
            <span>以上产品规格、数量确认后可签字认可。</span>
          </td>
          <td colSpan={this.state.columnStyle === 'single' ? 3 : 7}>
            备注 {record.comments}
          </td>
        </tr>
        </tbody>
      </table>
      <table style={{tableLayout: 'fixed', fontSize: '11px', width: '100%'}}>
        <tbody>
        <tr>
          <td>制单人：{record.username}</td>
          <td>{outLabel}（签名）：</td>
          <td>{inLabel}（签名）：</td>
        </tr>
        </tbody>
      </table>
    </div>


    const PrintSwitchContent = () => {
      const isPrint = useMediaQuery('print')

      return isPrint ? <PrintContent/> : <Card>
        <CardHeader
          title={
            <RadioGroup
              style={{ flexDirection: 'row' }}
              value={this.state.columnStyle}
              onChange={e => this.setState({ columnStyle: e.target.value })}>
              <FormControlLabel control={<Radio />} value="single" label="单栏" />
              <FormControlLabel control={<Radio />} value="double" label="双栏" />
            </RadioGroup>
          }
          action={<>
            <Button className="btn btn-default" onClick={() => router.goBack()}>返回</Button>
            {isUpdatable(store, user) && <>
              {record.type === '调拨' &&
              <Button color="primary" component={Link} to={`/transfer/${direction}/${record._id}/edit`}>编辑</Button>
              }
              {record.type === '销售' &&
              <Button color="primary" component={Link} to={`/purchase/out/${record._id}/edit`}>编辑</Button>
              }
              {record.type === '采购' &&
              <Button color="primary" component={Link} to={`/purchase/in/${record._id}/edit`}>编辑</Button>
              }
            </>}
            <Button onClick={this.handleTransport}>运输单</Button>
            <Button onClick={() => window.print()}>打印</Button>
            <Button >审核确认</Button>
          </>}
        />
        <CardContent>
          <PrintContent/>
        </CardContent>
      </Card>

    }

    return (
      <PrintSwitchContent/>
    )
  }
}

const mapStateToProps = state => ({
  projects: state.system.projects,
  articles: state.system.articles.toArray(),
  products: state.system.products,
  store: state.system.store,
  user: state.system.user,
  printCompany: state.system.printCompany,
})

export default connect(mapStateToProps)(PurchaseOrder)
