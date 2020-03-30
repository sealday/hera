import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import {
  Button,
  Card,
  CardHeader,
  CardContent,
} from '@material-ui/core'

import ContactList from './ContactList'
import BankList from './BankList'
import { Input, Select } from '../components'

import {
  TAB2TYPE,
} from '../utils'

class ProjectForm extends Component {
  render() {
    const { title, router } = this.props
    return (
      <form className="form-horizontal project-modify-form" method="post" onSubmit={this.props.handleSubmit}>
        <Card>
          <CardHeader title={title} action={<>
            <Button onClick={() => router.goBack()}>返回</Button>
            <Button color="primary" type="submit">保存</Button>
          </>} />
          <CardContent>
            <div className="form-group">
              <label className="control-label col-md-2">类型</label>
              <div className="col-md-3">
                <Field name="type" component={Select}>
                  {TAB2TYPE.map((name, i) => (
                    <option key={i}>{name}</option>
                  ))}
                </Field>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">单位名称<span className="important-star">(*)</span></label>
              <div className="col-md-3">
                <Field name="company" component={Input}/>
              </div>
              <label className="control-label col-md-2">项目名称<span className="important-star">(*)</span></label>
              <div className="col-md-5">
                <Field name="name" component={Input}/>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">单位电话</label>
              <div className="col-md-3">
                <Field name="companyTel" component={Input}/>
              </div>
              <label className="control-label col-md-2">项目电话</label>
              <div className="col-md-5">
                <Field name="tel" component={Input}/>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2">地址</label>
              <div className="col-md-10">
                <Field name="address" component={Input}/>
              </div>
            </div>
            <Field name="contacts" component={ContactList}/>
            <Field name="banks" component={BankList}/>
            <div className="form-group">
              <label className="control-label col-md-2">备注</label>
              <div className="col-md-10">
                <Field name="comments" component={Input}/>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    )
  }
}

ProjectForm = reduxForm({
  form: 'ProjectEditForm',
})(ProjectForm)


export default ProjectForm
