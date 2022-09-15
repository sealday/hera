import { useDispatch } from 'react-redux'

import ProjectForm from './ProjectForm'
import { postProject } from '../../actions'
import { DEFAULT_STORE_TYPE } from '../../utils'
import { PageHeader } from '../../components'
import { submit } from 'redux-form'

export default () => {
  const dispatch = useDispatch()
  const handleSubmit = (project) => {
    dispatch(postProject(project))
  }

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