import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router'

import { toFixedWithoutTrailingZero as fixed, total_, isUpdatable, getUnit } from '../utils'

class PurchaseOrder extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      columnStyle: 'single', // 栏目样式，支持单栏和双栏
    }

  }

  handleTransport = () => {
    const { router, record } = this.props
    router.push(`/transport/${record._id}`)
  }

  render() {
    const { record, store, articles, router, user, printCompany } = this.props

    let orderName = ''
    let direction = ''
    // 判断是收料单还是发料单
    if (record.inStock === store._id) {
      // 入库是当前操作仓库时，是入库单
      orderName = '收料单'
      direction = 'in'
      if (record.type === '调拨') {
      } else if (record.type === '采购') {
        orderName = '采购入库单'
      }
    } else if (record.outStock === store._id) {
      // 出库是当前操作仓库时，是出库单
      orderName = '出库单'
      direction = 'out'
      if (record.type === '调拨') {
      } else if (record.type === '销售') {
        orderName = '销售出库单'
      } else if (record.type === '盘点入库') {
        orderName = '盘点入库单'
      } else if (record.type === '盘点出库') {
        orderName = '盘点出库单'
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

    return (
      <div>
        <div className="btn-group hidden-print">
          <button className="btn btn-default" onClick={() => router.goBack()}>返回</button>
          {isUpdatable(store, user) && <span>
            {record.type === '调拨' &&
            <Link className="btn btn-primary" to={`/transfer/${direction}/${record._id}/edit`}>编辑</Link>
            }
            {record.type === '销售' &&
            <Link className="btn btn-primary" to={`/purchase/out/${record._id}/edit`}>编辑</Link>
            }
            {record.type === '采购' &&
            <Link className="btn btn-primary" to={`/purchase/in/${record._id}/edit`}>编辑</Link>
            }
            {record.type === '盘点入库' &&
            <Link className="btn btn-primary" to={`/stocktaking/in/${record._id}/edit`}>编辑</Link>
            }
            {record.type === '盘点出库' &&
            <Link className="btn btn-primary" to={`/stocktaking/out/${record._id}/edit`}>编辑</Link>
            }
          </span>}
          <button className="btn btn-default" onClick={() => window.print()}>打印</button>
          <a className="btn btn-default" href="check">审核确认</a>

        </div>
        <div className="btn-group pull-right hidden-print">
          <label className="btn btn-default">
            <input
              type="radio"
              autoComplete="off"
              value="single"
              checked={this.state.columnStyle === 'single'}
              onChange={e => this.setState({ columnStyle: e.target.value })}/>单栏
          </label>
          <label className="btn btn-default">
            <input
              type="radio"
              autoComplete="off"
              value="double"
              checked={this.state.columnStyle === 'double'}
              onChange={e => this.setState({ columnStyle: e.target.value })}/>双栏
          </label>
        </div>
        <h4 className="text-center">{printCompany}</h4>
        <h4 className="text-center">{orderName}</h4>
        <table style={{tableLayout: 'fixed', fontSize: '11px', width: '100%'}}>
          <colgroup>
            <col style={{width: '50%'}}/>
          </colgroup>
          <tbody>
          <tr>
            <td/>
            <td>日期：{moment(record.outDate).format('YYYY-MM-DD')}</td>
            <td>流水号：{record.number}</td>
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
            <td colSpan={this.state.columnStyle === 'single' ? 7 : 14}>
              备注 {record.comments}
            </td>
          </tr>
          </tbody>
        </table>
        <table style={{tableLayout: 'fixed', fontSize: '11px', width: '100%'}}>
          <tbody>
          <tr>
            <td>制单人：{record.username}</td>
          </tr>
          </tbody>
        </table>
      </div>
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