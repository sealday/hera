import React from 'react'
import { Input } from '../components'
import { Field } from 'redux-form'
import { validator } from '../utils'

export default class ProductForm extends React.Component {
  render() {
    return (
      <form className="form-inline" onSubmit={this.props.handleSubmit}>
        <div className="form-group">
          <label>编号</label>
          <Field disabled={this.props.action === 'edit'} name="number" component={Input} validate={[validator.required, validator.num]} />
        </div>
        <div className="form-group">
          <label>类型</label>
          <Field name="type" component={Input}  validate={[validator.required]} />
        </div>
        <div className="form-group">
          <label>型号</label>
          <Field name="model" component={Input}  />
        </div>
        <div className="form-group">
          <label>名称</label>
          <Field name="name" component={Input} validate={[validator.required]} />
        </div>
        <div className="form-group">
          <label>规格</label>
          <Field name="size" component={Input} validate={[validator.required]} />
        </div>
        <div className="form-group">
          <label>理论重量（千克）</label>
          <Field name="weight" component={Input} validate={[validator.required, validator.num]} />
        </div>
        <div className="form-group">
          <label>计量单位</label>
          <Field name="countUnit" component={Input} validate={[validator.required]} />
        </div>
        <div className="form-group">
          <label>换算单位</label>
          <Field name="unit" component={Input} />
        </div>
        <div className="form-group">
          <label>换算比例</label>
          <Field name="scale" component={Input} validate={validator.num} />
        </div>
        <div className="form-group">
          <label>是否需要换算</label>
          <Field name="isScaled" component={Input} type="checkbox" />
        </div>
      </form>
    )
  }
}
