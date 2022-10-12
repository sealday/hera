import { useDispatch } from 'react-redux'

import ProjectForm from './ProjectForm'
import { DEFAULT_STORE_TYPE } from '../../utils'
import { PageHeader } from '../../components'
import { submit } from 'redux-form'
import heraApi from '../../api'
import { useNavigate } from 'utils/hooks'
import { useEffect } from 'react'

export default () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [createProject, createResult] = heraApi.useCreateProjectMutation()
  const handleSubmit = (project) => {
    createProject(project)
  }
  useEffect(() => {
    if (createResult.isSuccess) {
      navigate(-1)
    }
  }, [navigate, createResult.isSuccess])

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
    type: DEFAULT_STORE_TYPE
  }
  return (
    <PageHeader
      title='项目信息录入'
      onSave={() => { dispatch(submit('ProjectEditForm')) }}
    >
      <ProjectForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </PageHeader>
  )
}