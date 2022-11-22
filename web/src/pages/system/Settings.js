import SettingsForm from './SettingsForm.js'
import { saveSettings } from '../../actions'
import { PageHeader } from '../../components'
import { useSelector } from 'react-redux'
import { Form } from 'antd'
import { useDispatch } from 'react-redux'


const Settings = () => {

  const dispatch = useDispatch()
  const handleSubmit = (settings) => {
    dispatch(saveSettings(settings))
  }
  const [form] = Form.useForm()
  const config = useSelector(state => state.system.config)

  return (
    <PageHeader
      title='基础配置'
      onSave={() => form.submit()}
    >
      <SettingsForm
        form={form}
        initialValues={{
          systemName: config.systemName,
          externalNames: config.externalNames,
          printSideComment: config.printSideComment,
          orderPrintSideComment: config.orderPrintSideComment,
          posts: config.posts || [],
        }}
        onSubmit={handleSubmit}
      />
    </PageHeader>
  )
}

export default Settings