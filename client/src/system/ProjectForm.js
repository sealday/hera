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

class ProjectForm extends Component {
  render() {
    const { action, title } = this.props
    return (
      <form className="form-horizontal project-modify-form" method="post" onSubmit={this.props.handleSubmit}>
        <Card>
          <CardHeader title={title} action={action} />
          <CardContent>
            <div className="form-group">
              <label className="control-label col-sm-2">单位名称<span className="important-star">(*)</span></label>
              <div className="col-sm-3">
                <Field name="company" component={Input}/>
              </div>
              <label className="control-label col-sm-2">项目名称<span className="important-star">(*)</span></label>
              <div className="col-sm-5">
                <Field name="name" component={Input}/>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2">单位电话</label>
              <div className="col-sm-3">
                <Field name="companyTel" component={Input}/>
              </div>
              <label className="control-label col-sm-2">项目电话</label>
              <div className="col-sm-5">
                <Field name="tel" component={Input}/>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2">地址</label>
              <div className="col-sm-10">
                <Field name="address" component={Input}/>
              </div>
            </div>
            <Field name="contacts" component={ContactList}/>
            <Field name="banks" component={BankList}/>
            <div className="form-group">
              <label className="control-label col-sm-2">仓库类型</label>
              <div className="col-sm-3">
                <Field name="type" component={Select}>
                  <option>项目部仓库</option>
                  <option>基地仓库</option>
                  <option>第三方仓库</option>
                  <option>供应商</option>
                  <option>承运商</option>
                </Field>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2">备注</label>
              <div className="col-sm-10">
                <Field name="comments" component={Input}/>
              </div>
            </div>
            <Button variant="contained" color="primary" type="submit" fullWidth={true}>保存</Button>
          </CardContent>
        </Card>
      </form>
    )
  }
}

ProjectForm = reduxForm({
  form: 'project'
})(ProjectForm)


export default ProjectForm
