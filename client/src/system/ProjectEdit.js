import React, { Component } from 'react'
import { connect } from 'react-redux'
import shortid from 'shortid'

import { alterProject } from '../actions'
import ProjectForm from './ProjectForm'

class ProjectEdit extends Component {
  handleSubmit = project => {
    project._id = this.props.params.id
    this.props.dispatch(alterProject(project))
  }

  render() {
    const { project, router } = this.props
    project.contacts.forEach(contact => {
      if (!contact.key) {
        contact.key = shortid.generate()
      }
    })
    project.banks.forEach(bank => {
      if (!bank.key) {
        bank.key = shortid.generate()
      }
    })
    return (
      <ProjectForm
        onSubmit={this.handleSubmit}
        initialValues={project}
        router={router}
        title={"项目信息修改"}
      />
    )
  }
}

const mapStateToProps = (state, props) => ({
  project: state.system.projects.get(props.params.id)
})

export default connect(mapStateToProps)(ProjectEdit)
