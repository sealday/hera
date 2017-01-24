/**
 * Created by seal on 20/01/2017.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker'
import moment from 'moment'

class TransportOrderEdit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      'off-date'         : moment().startOf('day'),
      'arrival-date'     : moment().startOf('day').add(1, 'day'), // 到达日期
      weight             : '', // 重量
      price              : '', // 价格
      payer              : '', // 付款方
      'pay-info'         : '', // 付款信息
      payee              : '', // 收款人
      bank               : '', // 银行
      'delivery-party'   : '', // 发货单位
      'delivery-contact' : '', // 发货人
      'delivery-phone'   : '', // 发货人电话
      'delivery-address' : '', // 发货地址
      'receiving-party'  : '', // 收货单位
      'receiving-contact': '', // 收货联系
      'receiving-phone'  : '', // 收货人电话
      'receiving-address': '', // 收货地址
      'carrier-party'    : '', // 运输公司
      'carrier-name'     : '', // 司机名称
      'carrier-phone'    : '', // 司机电话
      'carrier-id'       : '', // 司机身份证号码
      'carrier-car'      : '', // 车牌号
    }
  }

  componentDidMount() {
    // 假设本地没有这个缓存，那么属于直接访问这个页面的情况，这时候跳转到订单页面
    if (!this.props.recordIdMap[this.props.params.id]) {
      this.props.router.push(`/transfer_order/${this.props.params.id}`)
    }
  }

  componentWillUnmount() {

  }

  handleCancel = e => {
    e.preventDefault()
    this.props.router.goBack()
  }

  handleSubmit = e => {
    e.preventDefault()
  }

  handleOffDateChange = (date) => {
    this.setState({
      'off-date': date
    })
  }

  handleArrivalDateChange = (date) => {
    this.setState({
      'arrival-date': date
    })
  }

  render() {
    return (
      <div>
        <h2>运输单编辑</h2>
        <form className="form-horizontal" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="col-sm-2 control-label">承租日期</label>
            <div className="col-sm-4">
              <DatePicker selected={this.state['off-date']} className="form-control" onChange={this.handleOffDateChange}/>
            </div>
            <label className="col-sm-2 control-label">到货日期</label>
            <div className="col-sm-4">
              <DatePicker selected={this.state['arrival-date']} className="form-control" onChange={this.handleArrivalDateChange}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">顿/趟</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="weight" name="weight" autoComplete="off" />
            </div>
            <label className="col-sm-2 control-label">单价</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="price" name="price" autoComplete="off" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">付款方</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="payer" name="payer" autoComplete="off" />
            </div>
            <label className="col-sm-2 control-label">付款约定</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="pay-info" name="pay-info" autoComplete="off" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">收款人</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="payee" name="payee" autoComplete="off" />
            </div>
            <label className="col-sm-2 control-label">银行信息</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="bank" name="bank" autoComplete="off" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">发货方单位</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="delivery-party" name="delivery-party" autoComplete="off" defaultValue="上海创兴建筑设备租赁有限公司松江基地仓库" />
            </div>
            <label className="col-sm-2 control-label">发货方联系人</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="delivery-contact" name="delivery-contact" autoComplete="off" defaultValue="张志良" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">发货方联系电话</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="delivery-phone" name="delivery-phone" autoComplete="off" defaultValue={18116282137} />
            </div>
            <label className="col-sm-2 control-label">发货人地址</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="delivery-address" name="delivery-address" autoComplete="off" defaultValue />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">收货方单位</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="receiving-party" name="receiving-party" autoComplete="off" defaultValue="中国建筑第八工程局有限公司江苏事业部前滩33号-1" />
            </div>
            <label className="col-sm-2 control-label">收货方联系人</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="receiving-contact" name="receiving-contact" autoComplete="off" defaultValue="罗炳翔" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">收货方联系电话</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="receiving-phone" name="receiving-phone" autoComplete="off" defaultValue={18116282118} />
            </div>
            <label className="col-sm-2 control-label">收货方地址</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="receiving-address" name="receiving-address" autoComplete="off" defaultValue />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">承运方单位</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="carrier-party" name="carrier-party" autoComplete="off" />
            </div>
            <label className="col-sm-2 control-label">承运方司机</label>
            <div className="col-sm-4">
              <input className="form-control" type="text" id="carrier-name" name="carrier-name" autoComplete="off" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">承运方联系号码</label>
            <div className="col-sm-10">
              <input className="form-control" type="text" id="carrier-phone" name="carrier-phone" autoComplete="off" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">司机身份证号</label>
            <div className="col-sm-10">
              <input className="form-control" type="text" id="carrier-id" name="carrier-id" autoComplete="off" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">车号</label>
            <div className="col-sm-10">
              <input className="form-control" type="text" id="carrier-car" name="carrier-car" autoComplete="off" defaultValue />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-6">
              <button className="btn btn-default btn-block" onClick={this.handleCancel}>取消编辑</button>
            </div>
            <div className="col-sm-6">
              <button className="btn btn-primary btn-block">提交</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    recordIdMap: state.recordIdMap,
  }
}

export default connect(mapStateToProps)(TransportOrderEdit);