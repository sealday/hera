/**
 * Created by seal on 15/01/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Button from '@material-ui/core/Button'

import { toFixedWithoutTrailingZero as fixed, total_, getUnit } from '../utils'
import config from './../config'


class TransferOrder extends React.Component {

  render() {
    const { record, store, projects, articles, router, printCompany } = this.props

    let orderName = ''
    let company = ''
    let companyLabel = '承租单位'
    let name = ''
    let nameLabel = '工程项目'

    let outLabel = '出租单位'
    let inLabel = '租借单位'

    let signer = '租用方'

    // 判断是收料单还是发料单
    if (record.inStock === store._id) {
      // 入库是当前操作仓库时，是入库单
      orderName = '收料单'
      if (record.type === '调拨') {
        company = projects.get(record.outStock).company
        name = projects.get(record.outStock).name
      }
    } else if (record.outStock === store._id) {
      // 出库是当前操作仓库时，是出库单
      orderName = '出库单'
      if (record.type === '调拨') {
        company = projects.get(record.inStock).company
        name = projects.get(record.inStock).name
      }
    } else {
      // FIXME 当两者都不是的时候，属于非法访问
      return <div>非法访问</div>
    }

    let entries = {}
    let total = {}
    record.entries.forEach(entry => {
      let result = total_(entry, this.props.products)

      if (entry.name in entries) {
        total[entry.name] += result
        entries[entry.name].push(entry)
      } else {
        entries[entry.name] = [entry]
        total[entry.name] = result
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
        entry.comments,
      ]))
      printEntries.push(
        [
          name,
          '小计',
          fixed(total[name])  + ' ' + getUnit(productTypeMap[name]),
          '',
        ]
      )
    }

    // TODO 这里不应该会出现 fee，如果出现就是错误的了
    if (record.type === '调拨') {
      if (!record.fee) {
        console.warn('调拨单费用不应该是null')
      }
      record.fee = record.fee || {}
      printEntries.push(
        [
          '运费：',
          `￥${record.fee.car || 0} `,
          '整理费：',
          `￥${record.fee.sort || 0}`,
        ]
      );
      printEntries.push(
        [
          '其他费用1：',
          `￥${record.fee.other1 || 0}`,
          `其他费用2：`,
          `￥${record.fee.other2 || 0}`,
        ]
      );
    }

    if (printEntries.length % 2 !== 0) {
      printEntries.push(['', '', '', ''])
    }

    let rows = []
    const half = printEntries.length / 2
    for (let i = 0; i < half; i++) {
      rows.push(printEntries[i].concat(printEntries[i + half]))
    }

    return (
      <div>
        <div className="hidden-print" style={{ display: 'flex' }}>
          <span style={{ flex: 1 }} />
          <Button onClick={() => router.goBack()}>返回</Button>
          <Button variant="raised" color="primary" onClick={() => window.print()}>打印</Button>
        </div>
        <div ref={(l) => window.temp2 = l} style={{ position: 'relative', paddingRight: '1.2em', minHeight: '30em' }}> {/* 表格开始 */}
          <div style={{
            position: 'absolute',
            top: '6.5em',
            fontSize: '9px',
            right: 0,
            width: '1.2em'
          }}>{config.print.side}</div>
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
          <table className="table table-bordered table--tight" style={{tableLayout: 'fixed', fontSize: '11px', marginBottom: '0'}}>
            <thead>
            <tr>
              <th className="text-right">名称</th>
              <th className="text-right">规格</th>
              <th className="text-right">数量</th>
              <th className="text-right">备注</th>
              <th className="text-right">名称</th>
              <th className="text-right">规格</th>
              <th className="text-right">数量</th>
              <th className="text-right">备注</th>
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
              <td colSpan="4" >
                <span>说明：如供需双方未签正式合同，本{orderName}经供需双方代表签字确认后，将作为合同</span>
                <span>及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。{signer}须核对</span>
                <span>以上产品规格、数量确认后可签字认可。</span>
              </td>
              <td colSpan="4">
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
      </div>
    );
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

export default connect(mapStateToProps)(TransferOrder)
