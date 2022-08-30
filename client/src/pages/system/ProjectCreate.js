import React, { Component } from 'react'
import { connect } from 'react-redux'

import ProjectForm from './ProjectForm'
import { postProject } from '../../actions'
import { DEFAULT_STORE_TYPE } from '../../utils'

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
      type: DEFAULT_STORE_TYPE}
    return (
      <ProjectForm
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        router={router}
        title="录入项目信息"
      />
    )
  }
}

export default connect()(ProjectCreate)