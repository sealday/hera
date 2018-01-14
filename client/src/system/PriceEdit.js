import React from 'react'
import Form from './PriceForm'
import { reduxForm } from 'redux-form'
import moment from 'moment'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { ajax } from '../utils'
import { PRICE_PLAN, queryPricePlan, newSuccessNotify, newInfoNotify, newErrorNotify  } from '../actions'

const PriceForm = reduxForm({ form: 'PRICE_EDIT', action: 'edit' })(Form)

class PriceEdit extends React.Component {
  componentDidMount() {
    if (!this.props.plan) {
      this.props.dispatch(queryPricePlan())
    }
  }

  handleSubmit = (data) => {
    const { params: { id } } = this.props
    this.props.dispatch(newInfoNotify('提示', '正在保存', 1000))
    ajax(`/api/price/${ id }`, {
      data: JSON.stringify(data),
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      this.props.dispatch(newSuccessNotify('提示', '保存成功', 1000))
      this.props.dispatch(push(`/price`))
    }).catch((err) => {
      this.props.dispatch(newErrorNotify('警告', '保存失败', 1000))
    })
  }

  render() {
    if (!this.props.plan) {
      return (<div>
        加载中
      </div>)
    }

    return (
      <div>
        <h2 className="page-header">价格方案编辑</h2>
        <PriceForm
          onSubmit={this.handleSubmit}
          initialValues={{
            ...this.props.plan,
            date: moment(this.props.date),
          }}
        />
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

export default connect(mapStateToProps)(PriceEdit)