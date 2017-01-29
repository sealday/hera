/**
 * Created by seal on 13/01/2017.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux'
import ProjectForm from './ProjectForm'
import { postProject } from '../actions'

class ProjectCreate extends Component {
  handleSubmit = (project) => {
    this.props.dispatch(postProject(project))
  }

  render() {
    const initialValues = {
      contacts: [{
        key: Date.now(),
        name: '',
        phone: '',
      }],
      type: '项目部仓库'}
    return (
      <div>
        <h2>录入项目信息</h2>
        <ProjectForm
          initialValues={initialValues}
          onSubmit={this.handleSubmit}
        />
      </div>
    )
  }
}

export default connect()(ProjectCreate);