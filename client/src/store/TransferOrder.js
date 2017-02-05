/**
 * Created by seal on 15/01/2017.
 */

import React from 'react';
import { connect } from 'react-redux'
import moment from 'moment'
import { calculateSize, toFixedWithoutTrailingZero } from '../utils'
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
    let key = 0; // 这里 key 不会影响性能，我们只显示，不会过滤任何一个字段，也不会重新排序等等
    record.entries.forEach(entry => {
      let result = entry.count * calculateSize(entry.size);

      if (entry.name in entries) {
        total[entry.name] += result;
        entries[entry.name].push(entry);
      } else {
        entries[entry.name] = [entry];
        total[entry.name] = result;
      }
    });

    let productTypeMap = {}
    articles.forEach(article => {
      productTypeMap[article.name] = article
    })

    let printEntries = []
    for (let name in entries) {
      /*eslint guard-for-in: off*/
      entries[name].forEach(entry => { /*eslint no-loop-func: off */
        printEntries.push(
          <tr className="text-right" key={key++}>
            <td>{entry.name}</td>
            <td>{entry.size ? entry.size.split(';').join(' ') + ' ' + productTypeMap[name].sizeUnit : ''}</td>
            <td>{entry.count + ' ' + productTypeMap[name].countUnit}</td>
          </tr>
        )
      })
      printEntries.push(
        <tr className="row-sum text-right" key={key++}>
          <td>{name}</td>
          <td>小计</td>
          <td>{toFixedWithoutTrailingZero(total[name])  + ' ' + productTypeMap[name].unit}</td>
        </tr>
      )
    }

    // TODO 这里不应该会出现 fee，如果出现就是错误的了
    if (record.type === '调拨') {
      if (!record.fee) {
        console.warn('调拨单费用不应该是null')
      }
      record.fee = record.fee || {}
      printEntries.push(
        <tr key={key++} className="text-right">
          <td />
          <td>{`运费：￥${record.fee.car || 0} `}</td>
          <td>{`整理费：￥${record.fee.sort || 0}`}</td>
        </tr>
      );

      printEntries.push(
        <tr key={key++} className="text-right">
          <td/>
          <td>{`其他费用1：￥${record.fee.other1 || 0}`}</td>
          <td>{`其他费用2：￥${record.fee.other2 || 0}`}</td>
        </tr>
      );
    }

    if (printEntries.length % 2 !== 0) {
      printEntries.push(<tr key={key++}><td>{'\u00a0'}</td><td/><td/></tr>)
    }

    const leftPart = printEntries.slice(0, printEntries.length / 2)
    const rightPart = printEntries.slice(printEntries.length / 2, printEntries.length)

    return (
        <div className="container-fluid">
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
          <h4 className="text-center">上海创兴建筑设备租赁有限公司</h4>
          <h4 className="text-center">{orderName}</h4>
          <div className="row">
            <div className="col-xs-6">
              <table className="table table-clean">
                <tbody>
                <tr>
                  <td className="text-left">{companyLabel}：{company}</td>
                </tr>
                <tr>
                  <td className="text-left">{nameLabel}：{name}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div className="col-xs-6">
              <table className="table table-clean">
                <tbody>
                <tr>
                  <td className="text-left">日期：{moment(record.outDate).format('YYYY-MM-DD')}</td>
                  <td className="text-left">流水号：{record.number}</td>
                </tr>
                <tr>
                  <td className="text-left">车号：{record.carNumber}</td>
                  <td className="text-left">原始单号：{record.originalOrder}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <table className="table text-right">
                <thead>
                <tr>
                  <th className="text-right">名称</th>
                  <th className="text-right">规格</th>
                  <th className="text-right">数量</th>
                </tr>
                </thead>
                <tbody>
                {leftPart}
                <tr>
                  <td colSpan="3" style={{height: '7em'}} className="text-left">
                    <span>说明：如供需双方未签正式合同，本{orderName}经供需双方代表签字确认后，将作为合同</span>
                    <span>及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。{signer}须核对</span>
                    <span>以上产品规格、数量确认后可签字认可。</span>
                  </td>
                </tr>
                <tr>
                  <td/>
                  <td/>
                  <td/>
                </tr>
                </tbody>
              </table>
            </div>
            <div className="col-xs-6">
              <table className="table">
                <thead>
                <tr>
                  <th className="text-right">名称</th>
                  <th className="text-right">规格</th>
                  <th className="text-right">数量</th>
                </tr>
                </thead>
                <tbody>
                {rightPart}
                <tr>
                  <td colSpan="3" style={{height: '7em'}}>备注 {record.comments }</td>
                </tr>
                <tr>
                  <td/>
                  <td/>
                  <td/>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-4">
              <p>制单人：{record.username}</p>
            </div>
            <div className="col-xs-4">
              <p>{outLabel}（签名）：</p>
            </div>
            <div className="col-xs-4">
              <p>{inLabel}（签名）：</p>
            </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => ({
    projects: state.system.projects,
    articles: state.system.articles.toArray(),
    store: state.system.store
})

export default connect(mapStateToProps)(TransferOrder)