/**
 * Created by seal on 31/01/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { toFixedWithoutTrailingZero as fixed_  } from './../utils'
import { Link } from 'react-router'
import { updateTransportPaidStatus } from '../actions'

/**
 * 提供排序功能的搜索结果表
 */
class SimpleSearchTable extends React.Component {

  render() {
    const { search, projects, onLoad, dispatch } = this.props

    const getProjectName = id => {
      const project = projects.get(id)
      return project ? project.company + project.name : '';
    }

    const result = {};
    const resultUnpaid = {};
    const resultRows = [];
    const rows = search ? search.filter((entry) => entry.hasTransport) : []
    let total = 0
    let totalUnpaid = 0
    rows.forEach((entry, index) => {
      if (!entry.hasTransport) {
        // TODO 不是运费单，需要提醒用户
        return
      }
      entry.transport.fee = entry.transport.price * entry.transport.weight
      entry.transportPaid = entry.transportPaid || false
      total += entry.transport.fee || 0
      const payee = entry.transport.payee || '未填写'
      if (payee in result) {
        result[payee] += entry.transport.fee || 0
      } else {
        result[payee] = entry.transport.fee || 0
        resultUnpaid[payee] = 0
        resultRows.push({
          payee,
        })
      }
      if (!entry.transportPaid) {
        resultUnpaid[payee] += entry.transport.fee || 0
        totalUnpaid += entry.transport.fee || 0
      }
    })
    resultRows.push({
      payee: '合计',
    })
    result['合计'] = total
    resultUnpaid['合计'] = totalUnpaid

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">查询结果</h3>
        </div>
        <table className="table table-bordered" ref={onLoad}>
          <thead>
          <tr>
            <th>结清</th>
            <th>时间</th>
            <th>车号</th>
            <th>单号</th>
            <th>原始单号</th>
            <th>出库</th>
            <th>入库 </th>
            <th>收款人</th>
            <th>运费</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {rows.map((entry, index) => (
            <tr key={index}>
              <td>
                <input checked={entry.transportPaid}
                       type="checkbox"
                       onChange={(e) => { dispatch(updateTransportPaidStatus(entry._id, e.target.checked)) }}/>
              </td>
              <td>{moment(entry.outDate).format('YYYY-MM-DD')}</td>
              <td>{entry.carNumber}</td>
              <td>{entry.number}</td>
              <td>{entry.originalOrder}</td>
              <td>{getProjectName(entry.outStock) || entry.vendor}</td>
              <td>{getProjectName(entry.inStock) || entry.vendor}</td>
              <td>{entry.transport.payee}</td>
              <td>{fixed_(entry.transport.fee)}</td>
              <td>
                <Link to={`/transport/${entry._id}`}>查看运输单</Link>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        {resultRows.length > 0 && <div className="panel-heading">
          <h3 className="panel-title">查询结果统计</h3>
        </div>}
        {resultRows.length > 0 && <table className="table table-bordered">
          <thead>
          <tr>
            <th>收款人</th>
            <th>小计</th>
            <th>未结清款</th>
          </tr>
          </thead>
          <tbody>
          {resultRows.map((row, i) => (
            <tr key={i}>
              <td>{row.payee}</td>
              <td>{fixed_(result[row.payee])}</td>
              <td>{fixed_(resultUnpaid[row.payee])}</td>
            </tr>
          ))}
          </tbody>
        </table>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  projects: state.system.projects,
  articles: state.system.articles.toArray(),
  store: state.system.store,
})

export default connect(mapStateToProps)(SimpleSearchTable)