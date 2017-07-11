/**
 * Created by seal on 7/11/17.
 */
import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Input } from './index'

const ProfileForm = (props) => (
  <div>
    <h2 className="page-header">个人信息修改</h2>

    <form onSubmit={props.handleSubmit}>
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
      <button className="btn btn-primary">保存修改</button>
    </form>
  </div>
)

export default reduxForm({
  form: 'profile'
})(ProfileForm)
