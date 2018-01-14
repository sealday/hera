import React from 'react'
import { Field } from 'redux-form'
import { Input } from '../components'
import { validator } from '../utils'

class PriceForm extends React.Component {
  render() {
    return (
      <form className="form-inline" onSubmit={this.props.handleSubmit}>
        <div className="form-group">
          <label>名称</label>
          <Field name="name" component={Input}  validate={[validator.required]} />
        </div>
        <div className="form-group">
          <label>日期</label>
          <Field name="date" component={Input}  />
        </div>
        <div className="form-group">
          <label>备注</label>
          <Field name="comments" component={Input}  />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">{this.props.action === 'create' ? '新增' : '保存'}</button>
        </div>
      </form>
    )
  }
}

export default PriceForm