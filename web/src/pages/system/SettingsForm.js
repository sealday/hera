import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Card } from 'antd'

import { Input, EditableTagGroup } from '../../components'

const SettingsForm = props => (
  <Card>
    <form onSubmit={props.handleSubmit}>
      <div className="form-group">
        <label className="col-md-2 control-label">系统名称</label>
        <div className="col-md-10">
          <Field name="systemName" component={Input} validate={value => value ? undefined : '不能为空'} />
        </div>
      </div>
      <div className="form-group">
        <label className="col-md-2 control-label">对外公司名称</label>
        <div className="col-md-10">
          <Field name="externalNames" component={EditableTagGroup} />
        </div>
      </div>
      <div className="form-group">
        <label className="col-md-2 control-label">打印侧边说明</label>
        <div className="col-md-10">
          <Field name="printSideComment" component={Input} validate={value => value ? undefined : '不能为空'} />
        </div>
      </div>
      <div className="form-group">
        <label className="col-md-2 control-label">职务列表</label>
        <div className="col-md-10">
          <Field name="posts" component={EditableTagGroup} />
        </div>
      </div>
    </form>
  </Card>
)

export default reduxForm({
  form: 'SettingsForm'
})(SettingsForm)
