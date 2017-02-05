/**
 * Created by seal on 20/01/2017.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import TransportForm from './TransportForm'
import { ajax } from '../utils'
import { updateRecord } from '../actions'

class TransportOrderEdit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      'off-date'         : moment().startOf('day'),
      'arrival-date'     : moment().startOf('day').add(1, 'day'), // 到达日期
      weight             : '', // 重量
      price              : '', // 价格
      payer              : '', // 付款方
      payDate            : null, // 付款日期
      'pay-info'         : '', // 付款信息
      payee              : '', // 收款人
      bank               : '', // 收款人开户行
      account            : '', // 收款人账号
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
      this.props.router.push(`/transport/${this.props.params.id}`)
    }

    const record = this.props.recordIdMap[this.props.params.id]
    if (record.hasTransport) {
      this.setState({
        ...record.transport,
        'off-date': moment(record.transport['off-date']),
        'arrival-date': moment(record.transport['arrival-date']),
        payDate: record.transport.payDate && moment(record.transport.payDate)
      })
    } else {
      const projects = this.props.projects
      const inStock = projects[record.inStock]
      const outStock = projects[record.outStock]
      let deliveryParty
      let deliveryPhone
      let deliveryContact
      let deliveryAddress
      let receivingParty
      let receivingPhone
      let receivingContact
      let receivingAddress

      switch (record.type) {
        case '销售':
          deliveryParty = outStock.company + outStock.name
          deliveryContact = outStock.contacts[0].name
          deliveryPhone = outStock.contacts[0].phone
          deliveryAddress = outStock.address
          receivingParty = record.vendor
          break
        case '采购':
          deliveryParty = record.vendor
          receivingParty = inStock.company + inStock.name
          receivingContact = inStock.contacts[0].name
          receivingPhone = inStock.contacts[0].phone
          receivingAddress = inStock.address
          break
        case'调拨':
          receivingParty = inStock.company + inStock.name
          receivingContact = inStock.contacts[0].name
          receivingPhone = inStock.contacts[0].phone
          receivingAddress = inStock.address
          deliveryParty = outStock.company + outStock.name
          deliveryContact = outStock.contacts[0].name
          deliveryPhone = outStock.contacts[0].phone
          deliveryAddress = outStock.address
          break
        default:
          throw '不支持的订单类型'
      }

      this.setState({
        'off-date'         : moment(record.outDate).startOf('day'),
        'arrival-date'     : moment(record.outDate).startOf('day').add(1, 'day'), // 到达日期
        'delivery-party'   : deliveryParty, // 发货单位
        'delivery-contact' : deliveryContact, // 发货人
        'delivery-phone'   : deliveryPhone, // 发货人电话
        'delivery-address' : deliveryAddress, // 发货地址
        'receiving-party'  : receivingParty, // 收货单位
        'receiving-contact': receivingContact, // 收货联系
        'receiving-phone'  : receivingPhone, // 收货人电话
        'receiving-address': receivingAddress, // 收货地址
        'carrier-car': record.carNumber,
      })
    }
  }

  handleCancel = e => {
    e.preventDefault()
    this.props.router.goBack()
  }

  handleSubmit = data => {
    ajax(`/api/transfer/${this.props.params.id}/transport`, {
      data: JSON.stringify(data),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      // 更新缓存中的数据
      this.props.dispatch(updateRecord(res.data.record))
      this.props.router.push(`/transport/${res.data.record._id}`)
    }).catch(err => {
      alert('出错了' + JSON.stringify(err));
    });
  }

  render() {
    if (this.state['delivery-party']) {
      return (
        <div>
          <button className="btn btn-default" onClick={this.handleCancel}>取消编辑</button>
          <h2>
            <span>运输单编辑</span>
          </h2>
          <TransportForm
            onSubmit={this.handleSubmit}
            initialValues={this.state}
            optionA={this.state['delivery-party']}
            optionB={this.state['receiving-party']}
          />
        </div>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => {
  return {
    recordIdMap: state.store.records.toObject(),
    projects: state.system.projects.toObject(),
  }
}

export default connect(mapStateToProps)(TransportOrderEdit);