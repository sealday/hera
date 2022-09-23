import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'utils/hooks'
import { submit } from 'redux-form'
import { Error, Loading, PageHeader } from '../../components'
import ProjectForm from './ProjectForm'
import heraApi from '../../api'
import { useParams } from 'utils/hooks'

export default () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const getProject = heraApi.useGetProjectQuery(id)
  const [updateProject, updateResult] = heraApi.useUpdateProjectMutation()
  useEffect(() => {
    if (updateResult.isSuccess) {
      navigate(-1)
    }
  }, [navigate, updateResult.isSuccess])
  if (getProject.isError) {
    return <Error />
  }
  if (getProject.isLoading) {
    return <Loading />
  }
  const project = getProject.data
  const handleSubmit = project => {
    updateProject({ id, project })
  }
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