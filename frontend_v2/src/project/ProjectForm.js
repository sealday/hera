/**
 * Created by seal on 22/01/2017.
 */
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form'
import ContactList from './ContactList'

const Input = ({ input }) => (
  <input {...input} className="form-control" />
)

const Select = ({ input, children }) => (
  <select {...input} className="form-control" >{children}</select>
)

class ProjectForm extends Component {
  render() {
    return (
      <form className="form-horizontal project-modify-form" method="post" onSubmit={this.props.handleSubmit}>
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
        <div className="form-group">
          <label className="control-label col-sm-2">仓库类型</label>
          <div className="col-sm-3">
            <Field name="type" component={Select}>
              <option>项目部仓库</option>
              <option>基地仓库</option>
              <option>第三方仓库</option>
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2">备注</label>
          <div className="col-sm-10">
            <Field name="comments" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-10 col-sm-2">
            <button className="btn btn-default btn-primary">创建</button>
          </div>
        </div>
      </form>
    )
  }
}

ProjectForm = reduxForm({
  form: 'project'
})(ProjectForm)


export default ProjectForm
