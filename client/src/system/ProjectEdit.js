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
    let project = this.props.project
    project.contacts.forEach(contact => {
      contact.key = shortid.generate()
    })
    return (
      <div>
        <h2>
          <button className="btn btn-default" onClick={e => this.props.router.goBack()}>返回</button>项目信息修改
        </h2>
        <ProjectForm
          onSubmit={this.handleSubmit}
          initialValues={project}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  project: state.system.projects.get(props.params.id)
})

export default connect(mapStateToProps)(ProjectEdit)
