import React from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import shortid from 'shortid'
import { submit } from 'redux-form'
import { alterProject } from '../../actions'
import { PageHeader } from '../../components'
import ProjectForm from './ProjectForm'

export default () => {
  const dispatch = useDispatch()
  const params = useParams()
  const project = useSelector(state => state.system.projects.get(params.id))
  const handleSubmit = project => {
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
    <PageHeader
      title='项目信息录入'
      onSave={() => { dispatch(submit('ProjectEditForm')) }}
    >
      <ProjectForm
        onSubmit={handleSubmit}
        initialValues={project}
      />
    </PageHeader>
  )
}