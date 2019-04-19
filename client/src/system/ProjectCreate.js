import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
} from '@material-ui/core'

import ProjectForm from './ProjectForm'
import { postProject } from '../actions'

class ProjectCreate extends Component {
  handleSubmit = (project) => {
    this.props.dispatch(postProject(project))
  }

  render() {
    const { router } = this.props
    const initialValues = {
      contacts: [{
        key: Date.now(),
        name: '',
        phone: '',
        number: '',
      }],
      banks: [{
        key: Date.now(),
        name: '',
        account: '',
        bank: '',
      }],
      type: '项目部仓库'}
    return (
      <ProjectForm
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        action={<Button onClick={() => router.goBack()}>返回</Button>}
        title="录入项目信息"
      />
    )
  }
}

export default connect()(ProjectCreate)