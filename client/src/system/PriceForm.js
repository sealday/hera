import React from 'react'
import { Field, FieldArray } from 'redux-form'
import { connect } from 'react-redux'

import { WEIGHT_PLAN } from '../actions'
import { Input, DatePicker, Select, TextArea, FilterSelect } from '../components'
import { validator } from '../utils'
import PriceEntry from './PriceEntry'

class PriceForm extends React.Component {

  getWeightPlanOptions = () => {
    const { plans } = this.props

    return plans.map(plan => ({
      value: plan._id,
      label: plan.name,
    })).concat({ value: '', label: '未使用' })
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div>
          <div className="form-group">
            <label className="control-label col-md-1">名称</label>
            <div className="col-md-3">
              <Field name="name" component={Input}  validate={[validator.required]} />
            </div>
            <label className="control-label col-md-1">日期</label>
            <div className="col-md-3">
              <Field name="date" component={DatePicker} validate={[validator.required]}/>
            </div>
            <label className="control-label col-md-2">运费（元/每吨）</label>
            <div className="col-md-2">
              <Field name="freight" component={Input} validate={[validator.required, validator.num]}  />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-md-1">运费类型</label>
            <div className="col-md-3">
              <Field name="freightType" component={Select} validate={[validator.required]}>
                <option>出库</option>
                <option>入库</option>
                <option>双向</option>
              </Field>
            </div>
            <label className="control-label col-md-1">计重方案</label>
            <div className="col-md-3">
              <Field
                name="weightPlan"
                component={FilterSelect}
                options={this.getWeightPlanOptions()}
                placeholder="计重方案"
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-1">备注</label>
          <div className="col-md-11">
            <Field name="comments" component={TextArea}  />
          </div>
        </div>
        <FieldArray name="userPlans" component={PriceEntry}/>
      </form>
    )
  }
}

const mapStateToProps = (state) => {
  const plans = state.results.get(WEIGHT_PLAN, [])
  return {
    plans: plans,
  }
}
export default connect(mapStateToProps)(PriceForm)
