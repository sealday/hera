import React from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import moment from 'moment'
import { connect } from 'react-redux'

import { FilterSelect, DatePicker, DateRangeModifier } from '../../components'
import { filterOption, validator, wrapper } from '../../utils'
import { PRICE_PLAN, queryPricePlan } from '../../actions'

/**
 * 搜索用的表单
 */
class SimpleSearchForm extends React.Component {

  getStockOptions = projects => {
    return [].concat(projects.filter(project => project.type !== '基地仓库').map(project => ({
      value: project._id,
      label: project.company + project.name,
      pinyin: project.pinyin
    })))
  }

  getPlanOptions = (plans) => {
    return [].concat(plans.map((plan) => ({
      value: plan._id,
      label: plan.name,
      pinyin: ''
    })))
  }

  changeRange = (start, end) => e => {
    e.preventDefault()
    this.props.change('startDate', start.startOf('day'))
    this.props.change('endDate', end.startOf('day'))
  }

  componentDidMount() {
    this.props.dispatch(queryPricePlan())
  }

  render() {
    const { handleSubmit, projects, startDate, endDate } = this.props
    return (
      <form onSubmit={handleSubmit}>
          <div className="form-horizontal">
            <div className="form-group">
              <label className="control-label col-md-1">项目部</label>
              <div className="col-md-5">
                <Field name="project"
                       component={FilterSelect}
                       placeholder="请选择要计算的项目部"
                       options={this.getStockOptions(projects)}
                       validate={[validator.required]}
                       filterOption={filterOption}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-1">开始日期</label>
              <div className="col-md-2">
                <Field name="startDate"
                       component={DatePicker}
                       selectsStart
                       startDate={startDate}
                       endDate={endDate}
                />
              </div>
              <label className="control-label col-md-1">结束日期</label>
              <div className="col-md-2">
                <Field name="endDate"
                       component={DatePicker}
                       selectsEnd
                       startDate={startDate}
                       endDate={endDate}
                />
              </div>
              <div className="col-md-6">
                <DateRangeModifier
                  change={this.props.change}
                  key_start="startDate"
                  key_end="endDate"
                  current={startDate}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-1">合同方案</label>
              <div className="col-md-5">
                <Field name="planId"
                       component={FilterSelect}
                       placeholder="请选择要使用的合同方案"
                       validate={[validator.required]}
                       options={this.getPlanOptions(this.props.plans)}
                       filterOption={filterOption}
                />
              </div>
            </div>
          </div>
      </form>
    )
  }
}

const selector = formValueSelector('rentCalcForm')
const mapStateToProps = state => {
  const plans = state.results.get(PRICE_PLAN, [])

  return {
    projects: state.system.projects.valueSeq().toArray(),
    startDate: selector(state, 'startDate'),
    endDate: selector(state, 'endDate'),
    plans: plans,
  }
}

export default wrapper([
  reduxForm({
    form: 'rentCalcForm',
    initialValues: {
      startDate: moment().startOf('day'),
      endDate: moment().startOf('day')
    }
  }),
  connect(mapStateToProps),
  SimpleSearchForm,
])