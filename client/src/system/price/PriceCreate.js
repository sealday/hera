import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import moment from 'moment'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'

import Form from './PriceForm'
import { ajax } from '../../utils'
import { newInfoNotify, newErrorNotify, newSuccessNotify, PRICE_PLAN, queryPricePlan } from '../../actions'
import { withRouter } from '../../components'
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
    ajax('/api/plan/price', {
      data: JSON.stringify(data),
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      this.props.dispatch(newSuccessNotify('提示', '创建成功', 1000))
      this.props.navigate(`/price`)
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
      <Card>
        <CardHeader
          title="合同方案创建"
          action={<>
            <Button onClick={e => this.props.router.goBack()}>取消</Button>
            <Button color="primary" onClick={() => this.form.submit()}>保存</Button>
          </>}
        />
        <CardContent>
          {id ?
            <PriceForm
              ref={form => this.form = form}
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
              ref={form => this.form = form}
              onSubmit={this.handleSubmit}
              initialValues={{
                date: moment(),
                freightType: '入库',
              }}
            />
          }
        </CardContent>
      </Card>
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

export default connect(mapStateToProps)(withRouter(PriceCreate))
