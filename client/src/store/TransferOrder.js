/**
 * Created by seal on 15/01/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { toFixedWithoutTrailingZero as fixed, total_ } from '../utils'
import { Link } from 'react-router'

class TransferOrder extends React.Component {

  handleTransport = () => {
    const { router, record } = this.props
    router.push(`/transport/${record._id}`)
  }

  render() {
    const { record, store, projects, articles, router } = this.props

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
        company = record.vendor
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
        company = record.vendor
        nameLabel = '出售项目'
        signer = '采购方'
        name = projects.get(record.outStock).company + projects.get(record.outStock).name
      }
    } else {
      // FIXME 当两者都不是的时候，属于非法访问
      return <div>非法访问</div>
    }

    let entries = {}
    let total = {}
    record.entries.forEach(entry => {
      let result = total_(entry)

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
        entry.size ? entry.size.split(';').join(' ') + ' ' + productTypeMap[name].sizeUnit : '',
        entry.count + ' ' + productTypeMap[name].countUnit,
        entry.comments,
      ]))
      printEntries.push(
        [
          name,
          '小计',
          fixed(total[name])  + ' ' + productTypeMap[name].unit,
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
        <div className="btn-group hidden-print">
          <button className="btn btn-default" onClick={() => router.goBack()}>返回</button>
          {record.type === '调拨' &&
          <Link className="btn btn-primary" to={`/transfer/${direction}/${record._id}/edit`}>编辑</Link>
          }
          {record.type === '销售' &&
          <Link className="btn btn-primary" to={`/purchase/out/${record._id}/edit`}>编辑</Link>
          }
          {record.type === '采购' &&
          <Link className="btn btn-primary" to={`/purchase/in/${record._id}/edit`}>编辑</Link>
          }
          <button className="btn btn-default" onClick={this.handleTransport}>运输单</button>
          <button className="btn btn-default" onClick={() => print()}>打印</button>
          <a className="btn btn-default" href="check">审核确认</a>
        </div>
        <div style={{ position: 'relative', paddingRight: '1.2em', minHeight: '30em' }}> {/* 表格开始 */}
          <div style={{
            position: 'absolute',
            top: '6.5em',
            fontSize: '9px',
            right: 0,
            width: '1.2em'
          }}>①发货方存根②收货方存根③承运方存根</div>
          <h4 className="text-center">上海创兴建筑设备租赁有限公司</h4>
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
  store: state.system.store,
})

export default connect(mapStateToProps)(TransferOrder)