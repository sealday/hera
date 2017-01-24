/**
 * Created by seal on 13/01/2017.
 */

import React, { Component } from 'react';
import { ajax } from '../utils'
import { connect } from 'react-redux'
import ProjectForm from './ProjectForm'

class ProjectCreate extends Component {
  handleSubmit = (data) => {
    ajax('/api/project', {
      data: JSON.stringify(data),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      alert(res.message + "\n稍后将自动跳转到项目列表")
      //ajax('/api/project').then(res => {
      //  const projects = res.data.projects
      //  this.props.dispatch({ type: "UPDATE_PROJECTS", projects });
      //  this.props.router.push('/project')
      //}).catch(res => {
      //  alert('更新项目列表出错' + JSON.stringify(res));
      //});

    }).catch(err => {
      alert(`创建项目出错了！${JSON.stringify(err)}`)
    })
  }

  render() {
    const initialValues = {
      contacts: [{
        key: Date.now(),
        name: '',
        phone: '',
      }
      ],
      type: '项目部仓库'}
    return (
      <div>
        <ProjectForm initialValues={initialValues}
                     onSubmit={this.handleSubmit}
        />
      </div>
    )
  }
}

export default connect()(ProjectCreate);