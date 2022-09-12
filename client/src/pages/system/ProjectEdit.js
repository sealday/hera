import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import shortid from 'shortid'

import { alterProject } from '../../actions'
import { withRouter } from '../../components'
import ProjectForm from './ProjectForm'

const ProjectEdit = ({ project, dispatch, handleSubmit }) => {
  const params = useParams()
  handleSubmit = project => {
    project._id = params.id
    dispatch(alterProject(project))
  }
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
      onSubmit={handleSubmit}
      initialValues={project}
      title={"项目信息修改"}
    />
  )
}

const mapStateToProps = (state, props) => {
  return ({
    project: state.system.projects.get(props.params.id)
  })
}

export default withRouter(connect(mapStateToProps)(ProjectEdit))
