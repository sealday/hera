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
          <fieldset>
            <legend>基本资料</legend>
            <div className="form-group">
              <label>用户名</label>
              <Field name="username" component={Input} validate={value => value ? undefined : '不能为空'} />
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
              <label>备注</label>
              <Field name="comments" component={Input} />
            </div>
          </fieldset>
          <fieldset>
            <legend>操作员角色</legend>
            <div className="radio">
              <label>
                <Field type="radio" component="input" name="role" value="系统管理员"/> 系统管理员
              </label>
            </div>
            <div className="radio">
              <label>
                <Field type="radio" component="input" name="role" value="基地仓库管理员"/> 基地仓库管理员
              </label>
            </div>
            <div className="radio">
              <label>
                <Field type="radio" component="input" name="role" value="项目部管理员"/> 项目部管理员
              </label>
            </div>
          </fieldset>
          <div className="form-group">
            <button className="btn btn-primary btn-block">{this.props.btnName}</button>
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
