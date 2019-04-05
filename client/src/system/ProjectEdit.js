import React, { Component } from 'react'
import { connect } from 'react-redux'
import shortid from 'shortid'
import {
  Button,
} from '@material-ui/core'

import { alterProject } from '../actions'
import ProjectForm from './ProjectForm'

class ProjectEdit extends Component {
  handleSubmit = project => {
    project._id = this.props.params.id
    this.props.dispatch(alterProject(project))
  }

  render() {
    let project = this.props.project
    project.contacts.forEach(contact => {
      contact.key = shortid.generate()
    })
    project.banks.forEach(bank => {
      bank.key = shortid.generate()
    })
    return (
      <ProjectForm
        onSubmit={this.handleSubmit}
        initialValues={project}
        action={<Button onClick={() => this.props.router.goBack()}>返回</Button>}
        title={"项目信息修改"}
      />
    )
  }
}

const mapStateToProps = (state, props) => ({
  project: state.system.projects.get(props.params.id)
})

export default connect(mapStateToProps)(ProjectEdit)
