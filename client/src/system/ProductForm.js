import React from 'react'
import { Field } from 'redux-form'

import { Input } from '../components'
import { validator } from '../utils'

export default class ProductForm extends React.Component {
  render() {
    return (
      <form className="form-inline" onSubmit={this.props.handleSubmit}>
        <div className="form-group">
          <label className="control-label col-md-2">编号</label>
          <div className="col-md-10">
            <Field disabled={this.props.action === 'edit'} name="number" component={Input} validate={[validator.required, validator.num]} />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">类型</label>
          <div className="col-md-10">
            <Field name="type" component={Input}  validate={[validator.required]} />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">型号</label>
          <div className="col-md-10">
            <Field name="model" component={Input}  />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">名称</label>
          <div className="col-md-10">
            <Field name="name" component={Input} validate={[validator.required]} />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">规格</label>
          <div className="col-md-10">
            <Field name="size" component={Input} validate={[validator.required]} />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">理论重量</label>
          <div className="col-md-10">
            <Field name="weight" component={Input} validate={[validator.required, validator.num]} addonAfter="千克" />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">计量单位</label>
          <div className="col-md-10">
            <Field name="countUnit" component={Input} validate={[validator.required]} />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">换算单位</label>
          <div className="col-md-10">
            <Field name="unit" component={Input} />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">换算比例</label>
          <div className="col-md-10">
            <Field name="scale" component={Input} validate={validator.num} />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">需要换算</label>
          <div className="col-md-10">
            <Field name="isScaled" component={Input} type="checkbox" />
          </div>
        </div>
      </form>
    )
  }
}
