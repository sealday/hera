/**
 * Created by seal on 15/01/2017.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux'
import moment from 'moment'
import { ajax, calculateSize, toFixedWithoutTrailingZero } from '../utils'
import { Link } from 'react-router'

class TransferOrder extends Component {

  render() {
    const id = this.props.params.recordId
    const record = this.props.recordIdMap[id]
    const projectIdMap = this.props.projectIdMap

    // 假设本地缓存中没有则进行一次网络请求
    if (!record || !projectIdMap) {
      ajax(`/api/transfer/${id}`).then(res => {
        const record = res.data.record
        this.props.dispatch({ type: 'UPDATE_RECORDS_CACHE', record })
      }).catch(err => {
        alert('请求调拨单失败，请尝试刷新页面' + JSON.stringify(err))
      })
      return (
        <div className="alert alert-info">
          <p>请求数据中，请稍后</p>
        </div>
      )
    }

    const base = this.props.base

    let orderName = ''
    let company = ''
    let name = ''
    let direction = ''

    // 判断是收料单还是发料单
    if (record.inStock == base._id) {
      // 入库是基地，是收料单
      orderName = '收料单'
      direction = 'in'
      company = projectIdMap[record.outStock].company
      name = projectIdMap[record.outStock].name
    } else if (record.outStock == base._id) {
      // 出库是基地，是发料单
      orderName = '发料单'
      direction = 'out'
      company = projectIdMap[record.inStock].company
      name = projectIdMap[record.inStock].name
    } else {
      // TODO 考虑路径上加以区别，否则当属于项目部之间调货的时候就没有办法处理了
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
    this.props.articles.forEach(article => {
      productTypeMap[article.name] = article
    })

    let printEntries = []
    for (let name in entries) {
      entries[name].forEach(entry => {
        printEntries.push(
          <tr className="text-right" key={key++}>
            <td>{entry.name}</td>
            <td>{entry.size.split(';').join(' ') + ' ' + productTypeMap[name].sizeUnit}</td>
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

    if (printEntries.length % 2 != 0) {
      printEntries.push(<tr key={key++}><td>{'\u00a0'}</td><td/><td/></tr>)
    }

    const leftPart = printEntries.slice(0, printEntries.length / 2)
    const rightPart = printEntries.slice(printEntries.length / 2, printEntries.length)

    return (
        <div className="container-fluid">
          <div className="btn-group hidden-print">
            <Link className="btn btn-primary" to={`/transfer_${direction}/${record._id}`}>编辑</Link>
            <button className="btn btn-default" onClick={() => print()}>打印</button>
            <a className="btn btn-default" href="check">审核确认</a>
          </div>
          <h3 className="text-center">上海创兴建筑设备租赁有限公司</h3>
          <h3 className="text-center">{orderName}</h3>
          <table className="table table-clean">
            <tbody>
            <tr>
              <td/>
              <td/>
              <td className="text-right">单号：</td>
              <td className="text-center">{record._id}</td>
            </tr>
            <tr>
              <td/>
              <td/>
              <td className="text-right">原始单号：</td>
              <td className="text-center">{record.originalOrder}</td>
            </tr>
            <tr>
              <td>承租单位：</td>
              <td>{company}</td>
              <td className="text-right">日期：</td>
              <td className="text-center">{moment(record.outDate).format('YYYY-MM-DD')}</td>
            </tr>
            <tr>
              <td>工程项目：</td>
              <td>{name}</td>
              <td className="text-right">车号：</td>
              <td className="text-center">{record.carNumber}</td>
            </tr>
            </tbody>
          </table>
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
                  <td colSpan="3" style={{height: '10em'}} className="text-left">
                    <span>说明：如供需双方未签正式合同，本{orderName}经供需双方代表签字确认后，将作为合同</span>
                    <span>及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。租用方须核对</span>
                    <span>以上产品规格、数量确认后可签字认可。</span>
                    <span>说明：</span></td>
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
                  <td colSpan="3" style={{height: '10em'}}>备注 {record.commentst }</td>
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
              <p>出租单位（签名）：</p>
            </div>
            <div className="col-xs-offset-4 col-xs-4">
              <p>租借单位（签名）：</p>
            </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    recordIdMap: state.recordIdMap,
    projectIdMap: state.projectIdMap,
    articles: state.articles,
    base: state.base
  }
}

export default connect(mapStateToProps)(TransferOrder)