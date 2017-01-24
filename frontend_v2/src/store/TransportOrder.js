/**
 * Created by seal on 20/01/2017.
 */

import React, { Component } from 'react';

class TransportOrder extends Component {
  handleEdit = () => {
    this.props.router.push(`/transport/${this.props.router.params.id}/edit`)
  }

  handleBack = () => {
    this.props.router.goBack()
  }

  render() {
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
            <td colSpan="2"></td>
            <td>要求到货日期</td>
            <td></td>
          </tr>
          <tr>
            <td>货物名称及数量</td>
            <td colSpan="6"></td>
          </tr>
          <tr>
            <td>单价</td>
            <td></td>
            <td>吨/趟</td>
            <td></td>
            <td>（元）</td>
            <td>金额</td>
            <td></td>
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
            <td></td>
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

export default TransportOrder;
