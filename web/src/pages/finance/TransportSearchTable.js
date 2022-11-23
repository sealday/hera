import React from 'react'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import _ from 'lodash'
import { Link } from 'components'
import { Card } from 'antd'

import { toFixedWithoutTrailingZero as fixed_ } from '../../utils'
import { updateTransportPaidStatus, updateTransportCheckedStatus } from '../../actions'

/**
 * 提供排序功能的搜索结果表
 */
class SimpleSearchTable extends React.Component {


  getProjectName = id => {
    const { projects } = this.props
    const project = projects.get(id)
    return project ? project.company + project.name : '';
  }

  render() {
    const { search, onLoad, dispatch } = this.props


    const payeeInfo = {};
    const payees = [];
    const rows = search ? search.filter((entry) => entry.hasTransport) : []
    let total = {
      fee: 0,
      paid: 0,
      checked: 0,
    };
    rows.forEach((entry) => {
      if (!entry.hasTransport) {
        // TODO 不是运费单，需要提醒用户
        return
      }
      const fee = entry.transport.fee = (entry.transport.price * entry.transport.weight || 0) + _.toNumber(entry.transport.extraPrice ? entry.transport.extraPrice : 0)
      entry.transportPaid = entry.transportPaid || false
      entry.transportChecked = entry.transportChecked || false
      const payee = entry.transport.payee || '未填写'
      if (payee in payeeInfo) {
        payeeInfo[payee].fee += fee
      } else {
        payeeInfo[payee] = {
          fee: fee,
          paid: 0,
          checked: 0,
        }
        payees.push(payee)
      }
      total.fee += fee
      // 已支付
      if (entry.transportPaid) {
        payeeInfo[payee].paid += fee
        total.paid += fee
      }
      // 已核对
      if (entry.transportChecked) {
        payeeInfo[payee].checked += fee
        total.checked += fee
      }
    })
    payees.push('合计')
    payeeInfo['合计'] = {
      fee: total.fee,
      paid: total.paid,
      checked: total.checked,
    }

    return (
      <Card bordered={false}>
        <table className="table table-bordered" ref={onLoad} style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>结清</th>
              <th>核对</th>
              <th>时间</th>
              <th>车号</th>
              <th>单号</th>
              <th>原始单号</th>
              <th>出库</th>
              <th>入库</th>
              <th>收款人</th>
              <th>运费</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((entry, index) => (
              <tr key={index}>
                <td>
                  <input className="h-checkbox"
                    checked={entry.transportPaid}
                    type="checkbox"
                    id={`${entry._id}-paid`}
                    onChange={(e) => { dispatch(updateTransportPaidStatus(entry._id, e.target.checked)) }} />
                  <label className="hidden" htmlFor={`${entry._id}-paid`}>{entry.transportPaid ? '已结清' : '未结清'}</label>
                </td>
                <td>
                  <input className="h-checkbox"
                    checked={entry.transportChecked}
                    id={`${entry._id}-checked`}
                    type="checkbox"
                    onChange={(e) => { dispatch(updateTransportCheckedStatus(entry._id, e.target.checked)) }} />
                  <label className="hidden" htmlFor={`${entry._id}-checked`}>{entry.transportChecked ? '已核对' : '未核对'}</label>
                </td>
                <td>{dayjs(entry.outDate).format('YYYY-MM-DD')}</td>
                <td>{entry.carNumber}</td>
                <td>{entry.number}</td>
                <td>{entry.originalOrder}</td>
                <td>{this.getProjectName(entry.outStock) || entry.vendor}</td>
                <td>{this.getProjectName(entry.inStock) || entry.vendor}</td>
                <td>{entry.transport.payee}</td>
                <td>{fixed_(entry.transport.fee)}</td>
                <td>
                  <Link to={`/transport/${entry._id}`}>查看运输单</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>收款人</th>
              <th>小计</th>
              <th>已结清款</th>
              <th>未结清款</th>
              <th>已核对款</th>
              <th>未核对款</th>
            </tr>
          </thead>
          <tbody>
            {payees.map((payee, i) => (
              <tr key={i}>
                <td>{payee}</td>
                <td>{fixed_(payeeInfo[payee].fee)}</td>
                <td>{fixed_(payeeInfo[payee].paid)}</td>
                <td>{fixed_(payeeInfo[payee].fee - payeeInfo[payee].paid)}</td>
                <td>{fixed_(payeeInfo[payee].checked)}</td>
                <td>{fixed_(payeeInfo[payee].fee - payeeInfo[payee].checked)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  projects: state.system.projects,
  articles: state.system.articles.valueSeq().toArray(),
  store: state.system.store,
})

export default connect(mapStateToProps)(SimpleSearchTable)