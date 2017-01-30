/**
 * Created by seal on 25/01/2017.
 */
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form'
import { Input } from '../components'

class OperatorForm extends Component {
  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <Field name="username" component={Input} />
          </div>
          <div className="form-group">
            <label>密码</label>
            <Field name="password" component={Input} type="password" />
          </div>
          <div className="form-group">
            <label>姓名</label>
            <Field name="profile.name" component={Input} />
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-block">创建操作员</button>
          </div>
        </form>
      </div>
    )
  }
}

OperatorForm = reduxForm({
  form: 'operator'
})(OperatorForm)

export default OperatorForm;
