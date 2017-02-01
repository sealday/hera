/**
 * Created by seal on 20/01/2017.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { requestRecord } from '../actions'
import { toFixedWithoutTrailingZero } from '../utils'
import moment from 'moment'

class TransportOrder extends Component {
  handleEdit = () => {
    this.props.router.push(`/transport/${this.props.router.params.id}/edit`)
  }

  handleBack = () => {
    this.props.router.push(`/transfer/${this.props.params.id}`)
  }

  componentDidMount() {
    const record = this.props.record
    if (!record) {
      this.props.dispatch(requestRecord(this.props.id))
    }
  }

  render() {
    const record = this.props.record
    if (!record) {
      return <div>请求运输单！</div>
    }

    if (!record.hasTransport) {
      return  (
        <div>
          <h2>还未填写运输单！</h2>
          <button className="btn btn-default hidden-print" onClick={this.handleBack}>返回</button>
          <button className="btn btn-primary hidden-print" onClick={this.handleEdit}>填写运输单</button>
        </div>
      )
    }

    const transport = record.transport

    return (
      <div>
        <button className="btn btn-default hidden-print" onClick={this.handleBack}>返回</button>
        <button className="btn btn-primary hidden-print" onClick={this.handleEdit}>编辑</button>
        <h2 className="text-center">货运运输协议</h2>
        <table className="table table-bordered">
          <tbody>
          <tr>
            <th>日期</th>
            <th colSpan="2">承运日期</th>
            <td colSpan="2">{moment(transport['off-date']).format('YYYY-MM-DD')}</td>
            <th>要求到货日期</th>
            <td>{moment(transport['arrival-date']).format('YYYY-MM-DD')}</td>
          </tr>
          <tr>
            <th>货物名称及数量</th>
            <td colSpan="6"></td>
          </tr>
          <tr>
            <th>单价</th>
            <td>{transport.price}</td>
            <th>吨/趟</th>
            <td>{transport.weight}</td>
            <th>（元）</th>
            <th>金额</th>
            <td>{toFixedWithoutTrailingZero(transport.price * transport.weight)}</td>
          </tr>
          <tr>
            <th rowSpan="2">付款方式及收款人信息</th>
            <th>付款日期</th>
            <td colSpan="2">{transport.payDate && moment(transport.payDate).format('YYYY-MM-DD')}</td>
            <th>付款方</th>
            <td colSpan="2">{transport.payer}</td>
          </tr>
          <tr>
            <th>收款人</th>
            <td>{transport.payee}</td>
            <td colSpan="4">{transport.bank}</td>
          </tr>
          <tr>
            <th>说明</th>
            <td colSpan="6">本协议一式三联，三方各执一份，单价及吨位按签字确认付款</td>
          </tr>
          <tr>
            <th>目录</th>
            <th colSpan="3">发、收单位</th>
            <th>联系人</th>
            <th>电话号码</th>
            <th>发、收方地址</th>
          </tr>
          <tr>
            <th>收货方</th>
            <td colSpan="3">{transport['delivery-party']}</td>
            <td>{transport['delivery-contact']}</td>
            <td>{transport['delivery-phone']}</td>
            <td>{transport['delivery-address']}</td>
          </tr>
          <tr>
            <th>发货方</th>
            <td colSpan="3">{transport['receiving-party']}</td>
            <td>{transport['receiving-contact']}</td>
            <td>{transport['receiving-phone']}</td>
            <td>{transport['receiving-address']}</td>
          </tr>
          <tr>
            <th rowSpan="2">承运方</th>
            <th colSpan="3">承运单位</th>
            <th>驾驶员</th>
            <th>电话号码</th>
            <th>车号</th>
          </tr>
          <tr>
            <td colSpan="3">{transport['carrier-party']}</td>
            <td>{transport['carrier-name']}</td>
            <td>{transport['carrier-phone']}</td>
            <td>{transport['carrier-car']}</td>
          </tr>
          <tr>
            <th rowSpan="2">签字</th>
            <th rowSpan="2">托运方</th>
            <td colSpan="2" rowSpan="2"/>
            <th rowSpan="2">承运方</th>
            <td rowSpan="2"/>
            <th>身份证</th>
          </tr>
          <tr>
            <td>{transport['carrier-id']}</td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const id = props.params.id
  const record = state.store.records.get(id)
  return {
    record,
    id
  }
}

export default connect(mapStateToProps)(TransportOrder);
