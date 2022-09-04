import { useDispatch, useSelector } from 'react-redux'

import { saveProfile } from '../../actions'
import { PageHeader } from '../../components'
import ProfileForm from './ProfileForm'

export default () => {

  const user = useSelector(state => state.system.user)
  const dispatch = useDispatch()
  const handleSubmit = (profile) => {
    dispatch(saveProfile({
      ...profile,
      _id: this.props.user._id
    }))
  }
  return (
    <PageHeader title='个人信息修改'>
      <ProfileForm
        initialValues={{ ...user, password: undefined }}
        onSubmit={handleSubmit}
      />
    </PageHeader>
  )
}