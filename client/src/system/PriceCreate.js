import React from 'react'
import Form from './PriceForm'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { ajax } from '../utils'
import { newInfoNotify, newErrorNotify, newSuccessNotify, PRICE_PLAN, queryPricePlan } from '../actions'
import { push } from 'react-router-redux'
import moment from 'moment'

const PriceForm = reduxForm({ form: 'PRICE_CREATE', action: 'create' })(Form)

class PriceCreate extends React.Component {

  componentDidMount() {
    const { params: { id } } = this.props
    if (id && !this.props.plan) {
      this.props.dispatch(queryPricePlan())
    }
  }

  handleSubmit = (data) => {
    this.props.dispatch(newInfoNotify('提示', '正在创建', 1000))
    ajax('/api/price', {
      data: JSON.stringify(data),
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      this.props.dispatch(newSuccessNotify('提示', '创建成功', 1000))
      this.props.dispatch(push(`/price`))
    }).catch((err) => {
      this.props.dispatch(newErrorNotify('警告', '创建失败', 1000))
    })
  }
  render() {
    const { params: { id } } = this.props
    if (id && !this.props.plan) {
      return (<div>
        加载中
      </div>)
    }
    return (
      <div>
        <h2 className="page-header">价格方案创建</h2>
        {id ?
          <PriceForm
            onSubmit={this.handleSubmit}
            initialValues={{
              ...this.props.plan,
              date: moment(this.props.date),
              name: this.props.plan.name + '（克隆）',
              _id: undefined,
            }}
          />

          :
          <PriceForm
            onSubmit={this.handleSubmit}
            initialValues={{
              date: moment(),
              freightType: '入库',
            }}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const plans = state.results.get(PRICE_PLAN, [])
  const { params: { id } } = props
  const list = plans.filter((plan) => plan._id === id)
  const plan = list.length > 0 ? list[0] : null
  return {
    plan: plan,
  }
}

export default connect(mapStateToProps)(PriceCreate)