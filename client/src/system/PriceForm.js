import React from 'react'
import { Field, FieldArray } from 'redux-form'
import { Input, DatePicker, Select, TextArea } from '../components'
import { validator } from '../utils'
import PriceEntry from './PriceEntry'

class PriceForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div className="form-inline">
          <div className="form-group">
            <label>名称</label>
            <Field name="name" component={Input}  validate={[validator.required]} />
          </div>
          <div className="form-group">
            <label>日期</label>
            <Field name="date" component={DatePicker} validate={[validator.required]}/>
          </div>

          <div className="form-group">
            <label>运费（元/每吨）</label>
            <Field name="freight" component={Input} validate={[validator.required, validator.num]}  />
          </div>
          <div className="form-group">
            <label>运费类型</label>
            <Field name="freightType" component={Select} validate={[validator.required]}>
              <option>出库</option>
              <option>入库</option>
              <option>双向</option>
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label>备注</label>
          <Field name="comments" component={TextArea}  />
        </div>
        <FieldArray name="userPlans" component={PriceEntry}/>
        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-block">保存</button>
        </div>
      </form>
    )
  }
}

export default PriceForm