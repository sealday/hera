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
          ...config,
          systemName: config.systemName,
          externalNames: config.externalNames,
          printSideComment: config.printSideComment,
          orderPrintSideComment: config.orderPrintSideComment,
          posts: config.posts || [],
          counterfoilUsers: config.counterfoilUsers || [],
          counterfoilTimeout: config.counterfoilTimeout || 5,
          receiptUsers: config.receiptUsers || [],
          receiptTimeout: config.receiptTimeout || 5,
        }}
        onSubmit={handleSubmit}
      />
    </PageHeader>
  )
}

export default Settings