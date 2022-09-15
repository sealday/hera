import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Button, Card } from 'antd'

import { Input } from '../../components'

const ProfileForm = props => (
  <Card>
    <form onSubmit={props.handleSubmit}>
      <div className="form-group">
        <label className="col-md-2 control-label">用户名</label>
        <div className="col-md-10">
          <Field name="username" component={Input} validate={value => value ? undefined : '不能为空'} />
        </div>
      </div>
      <div className="form-group">
        <label className="col-md-2 control-label">密码</label>
        <div className="col-md-10">
          <Field name="password" component={Input} type="password" autoComplete={false} />
        </div>
      </div>
      <div className="form-group">
        <label className="col-md-2 control-label">姓名</label>
        <div className="col-md-10">
          <Field name="profile.name" component={Input} />
        </div>
      </div>
      <div className="form-group">
        <label className="col-md-2 control-label">备注</label>
        <div className="col-md-10">
          <Field name="comments" component={Input} />
        </div>
      </div>
      <Button type="primary" block htmlType="submit">保存</Button>
    </form>
  </Card>
)

export default reduxForm({
  form: 'ProfileForm'
})(ProfileForm)