import React from 'react'
import Form from './PriceForm'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { ajax } from '../utils'
import { newInfoNotify, newErrorNotify, newSuccessNotify } from '../actions'
import moment from 'moment'

const PriceForm = reduxForm({ form: 'PRICE_CREATE', action: 'create' })(Form)

class PriceCreate extends React.Component {
  handleSubmit = (data) => {
    console.log(data);
    this.props.dispatch(newInfoNotify('提示', '正在创建', 1000))
    ajax('/api/price', {
      data: JSON.stringify(data),
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      this.props.dispatch(newSuccessNotify('提示', '创建成功', 1000))
    }).catch((err) => {
      this.props.dispatch(newErrorNotify('警告', '创建失败', 1000))
    })
  }
  render() {
    return (
      <div>
        <h2 className="page-header">定价方案创建</h2>
        <PriceForm
          onSubmit={this.handleSubmit}
          initialValues={{
            date: moment(),
            freightType: '入库',
          }}
        />
      </div>
    )
  }
}

export default connect()(PriceCreate)