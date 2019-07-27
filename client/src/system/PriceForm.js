import React from 'react'
import { Field, FieldArray } from 'redux-form'
import { Input, DatePicker, Select, TextArea } from '../components'
import { validator } from '../utils'
import PriceEntry from './PriceEntry'

class PriceForm extends React.Component {
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

export default PriceForm