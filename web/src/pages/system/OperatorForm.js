import { Card } from 'antd'
import React, { Component } from 'react'
import {
  reduxForm,
  Field,
} from 'redux-form'
import { Input } from '../../components'

class OperatorForm extends Component {
  render() {
    const { projects, operator } = this.props
    return (
      <Card>
        <form onSubmit={this.props.handleSubmit}>
          <fieldset>
            <legend>基本资料</legend>
            <div className="form-group">
              <label className="control-label col-md-1">用户名</label>
              <div className="col-md-5">
                <Field name="username" component={Input} />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-1">密码</label>
              <div className="col-md-5">
                <Field name="password" component={Input} type="password" />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-1">姓名</label>
              <div className="col-md-5">
                <Field name="profile.name" component={Input} />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-1">备注</label>
              <div className="col-md-5">
                <Field name="comments" component={Input} />
              </div>
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
            <div className="radio">
              <label>
                <Field type="radio" component="input" name="role" value="成本估计管理员"/> 成本估计管理员
              </label>
            </div>
            <div className="radio">
              <label>
                <Field type="radio" component="input" name="role" value="财务管理员"/> 财务管理员
              </label>
            </div>
          </fieldset>
          {operator && (operator.role === '基地仓库管理员' || operator.role === '项目部管理员') &&
          <fieldset>
            <legend>项目权限</legend>
            <table className="table table-bordered">
              <thead>
              <tr>
                <th>项目</th>
                <th>查询</th>
                <th>增加</th>
                <th>修改</th>
              </tr>
              </thead>
              <tbody>
              {projects.valueSeq().toArray().map((project) => (
                <tr key={project._id}>
                  <td>{project.company} - {project.name}</td>
                  <td><Field type="checkbox" component="input" name={`perm.${project._id}.query`} /></td>
                  <td><Field type="checkbox" component="input" name={`perm.${project._id}.insert`} /></td>
                  <td><Field type="checkbox" component="input" name={`perm.${project._id}.update`} /></td>
                </tr>
              ))}
              </tbody>
            </table>
          </fieldset>
          }
        </form>
      </Card>
    )
  }
}

OperatorForm = reduxForm({
  form: 'operator'
})(OperatorForm)

export default OperatorForm
