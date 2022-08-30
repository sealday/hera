import React from 'react'
import { reduxForm } from 'redux-form'
import moment from 'moment'
import { connect } from 'react-redux'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'

import Form from './WeightForm'
import { ajax } from '../../utils'
import { WEIGHT_PLAN, queryPricePlan, newSuccessNotify, newInfoNotify, newErrorNotify  } from '../../actions'
import { withRouter } from '../../components'

const WeightForm = reduxForm({ form: 'WEIGHT_EDIT', action: 'edit' })(Form)

class WeightEdit extends React.Component {
  componentDidMount() {
    if (!this.props.plan) {
      this.props.dispatch(queryPricePlan())
    }
  }

  handleSubmit = (data) => {
    const { params: { id } } = this.props
    this.props.dispatch(newInfoNotify('提示', '正在保存', 1000))
    ajax(`/api/plan/weight/${ id }`, {
      data: JSON.stringify(data),
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      this.props.dispatch(newSuccessNotify('提示', '保存成功', 1000))
      this.props.navigate(`/weight`)
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
      <Card>
        <CardHeader
          title="计重方案编辑"
          action={<>
            <Button onClick={e => this.props.router.goBack()}>取消</Button>
            <Button color="primary" onClick={() => this.form.submit()}>保存</Button>
          </>}
        />
        <CardContent>
          <WeightForm
            ref={form => this.form = form}
            onSubmit={this.handleSubmit}
            initialValues={{
              ...this.props.plan,
              date: moment(this.props.date),
            }}
          />
        </CardContent>
      </Card>
    )
  }
}

const mapStateToProps = (state, props) => {
  const plans = state.results.get(WEIGHT_PLAN, [])
  const { params: { id } } = props
  const list = plans.filter((plan) => plan._id === id)
  const plan = list.length > 0 ? list[0] : null
  return {
    plan: plan,
  }
}

export default connect(mapStateToProps)(withRouter(WeightEdit))
