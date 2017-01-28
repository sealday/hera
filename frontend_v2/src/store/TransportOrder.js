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
    this.props.router.goBack()
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
          <button className="btn btn-primary hidden-print" onClick={this.handleEdit}>填写运输单</button>
        </div>
      )
    }

    const transport = record.transport

    //'arrival-date'     : moment().startOf('day').add(1, 'day'), // 到达日期
    //weight             : '', // 重量
    //price              : '', // 价格
    //payer              : '', // 付款方
    //'pay-info'         : '', // 付款信息
    //payee              : '', // 收款人
    //bank               : '', // 银行
    //'delivery-party'   : '', // 发货单位
    //'delivery-contact' : '', // 发货人
    //'delivery-phone'   : '', // 发货人电话
    //'delivery-address' : '', // 发货地址
    //'receiving-party'  : '', // 收货单位
    //'receiving-contact': '', // 收货联系
    //'receiving-phone'  : '', // 收货人电话
    //'receiving-address': '', // 收货地址
    //'carrier-party'    : '', // 运输公司
    //'carrier-name'     : '', // 司机名称
    //'carrier-phone'    : '', // 司机电话
    //'carrier-id'       : '', // 司机身份证号码
    //'carrier-car'      : '', // 车牌号
    return (
      <div>
        <button className="btn btn-default hidden-print" onClick={this.handleBack}>返回</button>
        <button className="btn btn-primary hidden-print" onClick={this.handleEdit}>编辑</button>
        <h2 className="text-center">货运运输协议</h2>
        <table className="table table-bordered">
          <tbody>
          <tr>
            <td>日期</td>
            <td colSpan="2">承运日期</td>
            <td colSpan="2">{moment(transport['off-date']).format('YYYY-MM-DD')}</td>
            <td>要求到货日期</td>
            <td>{moment(transport['arrival-date']).format('YYYY-MM-DD')}</td>
          </tr>
          <tr>
            <td>货物名称及数量</td>
            <td colSpan="6"> </td>
          </tr>
          <tr>
            <td>单价</td>
            <td>{transport.price}</td>
            <td>吨/趟</td>
            <td>{transport.weight}</td>
            <td>（元）</td>
            <td>金额</td>
            <td>{toFixedWithoutTrailingZero(transport.price * transport.weight)}</td>
          </tr>
          <tr>
            <td rowSpan="2">付款方式及收款人信息</td>
            <td>付款日期</td>
            <td colSpan="2"></td>
            <td>付款方</td>
            <td colSpan="2"></td>
          </tr>
          <tr>
            <td>收款人</td>
            <td>{transport.payer}</td>
            <td colSpan="4"></td>
          </tr>
          <tr>
            <td>说明</td>
            <td colSpan="6">本协议一式三联，三方各执一份，单价及吨位按签字确认付款</td>
          </tr>
          <tr>
            <td>目录</td>
            <td colSpan="3">发、收单位</td>
            <td>联系人</td>
            <td>电话号码</td>
            <td>发、收方地址</td>
          </tr>
          <tr>
            <td>收货方</td>
            <td colSpan="3"></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>发货方</td>
            <td colSpan="3"></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td rowSpan="2">承运方</td>
            <td colSpan="3">承运单位</td>
            <td>驾驶员</td>
            <td>电话号码</td>
            <td>车号</td>
          </tr>
          <tr>
            <td colSpan="3"></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td rowSpan="2">签字</td>
            <td rowSpan="2">托运方</td>
            <td colSpan="2" rowSpan="2"></td>
            <td rowSpan="2">承运方</td>
            <td rowSpan="2"></td>
            <td>身份证</td>
          </tr>
          <tr>
            <td></td>
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
