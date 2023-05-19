import _ from 'lodash'
import { Button, Drawer, Form, Space } from "antd"
import moment from "moment"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "utils/hooks"
import { useCreateRecordMutation } from "../../api"
import { Error, PageHeader } from "../../components"
import { ModalContext, RECORD_TYPE_MAP } from "../../globalConfigs"
import { createModal, DEFAULT_STORE_TYPE } from "../../utils"
import RecordForm from './RecordForm/index'
import { SettingContext } from "./records"
import { useParams } from 'utils/hooks'
import { useForm } from 'antd/lib/form/Form'
import { useDirection } from './Record'

const RecordCreate = ({ record, project, form: passedForm, onClose }) => {
  const [myForm] = Form.useForm()
  const form = passedForm ? passedForm : myForm
  const { type, direction } = useParams()
  const [createRecord, createResult] = useCreateRecordMutation()
  const navigate = useNavigate()
  const store = useSelector(state => state.system.store)
  // 切换页面不保存表单记录
  useEffect(() => {
    form.resetFields()
  }, [type, direction])
  // 创建结果
  useEffect(() => {
    if (createResult.isSuccess) {
      if (onClose) {
        onClose()
      } else {
        navigate(`/record/${createResult.data._id}`)
      }
    }
  }, [navigate, createResult.isSuccess])
  const associatedRecord = record
  // 提交处理
  const handleSubmit = (record) => {
    // 对齐接口
    record.entries = _.map(record.entries, item => ({
      ...item,
      ..._.zipObject(['type', 'name', 'size'], item.product),
    }))
    record.complements = _.map(record.complements, item => {
      const complement = {
        ...item,
      }
      if (item.level === 'associated') {
        const associateArray = JSON.parse(item.associate)
        complement.associate = _.zipObject(['type', 'name', 'size'], associateArray)
      }
      return complement
    })
    const recordForm = { ...record, type: RECORD_TYPE_MAP[type] }
    if (type === 'check') {
      recordForm.inStock = store._id
    } else if (direction === 'in') {
      recordForm.inStock = store._id
      recordForm.outStock = record.projectId
    } else if (direction === 'out') {
      recordForm.outStock = store._id
      recordForm.inStock = record.projectId
    }
    if (associatedRecord) {
      recordForm.associated = associatedRecord._id
    }
    createRecord(recordForm)
  }

  const titleParts = []
  const settings = {
    price: false,
    project: true,
    originalOrder: true,
    carNumber: true,
    weight: true,
    freight: false,
  }
  const initialValues = {
    outDate: moment(),
    type: DEFAULT_STORE_TYPE,
  }
  if (record) {
    initialValues.outDate = moment(record.outDate)
    initialValues.projectId = project._id
    initialValues.type = project.type
  }
  switch (type) {
    case 'transfer':
      titleParts.push('暂存')
      break;
    case 'purchase':
      titleParts.push(direction === 'in' ? '采购' : '销售')
      settings.price = true
      break;
    case 'rent':
      titleParts.push('租赁')
      settings.freight = true
      initialValues.freight = true
      break;
    case 'check':
      titleParts.push('盘点录入')
      settings.project = false
      settings.originalOrder = false
      settings.carNumber = false
      settings.weight = false
      break;
    default:
      return <Error message='暂时不支持这种形式' />
  }
  // 名称后缀
  titleParts.push(direction === 'in' ? '入库' : direction === 'out' ? '出库' : '')
  const pageTitle = titleParts.join('')
  return <PageHeader
    title={pageTitle}
    subTitle='正在录入'
    onSave={form.submit}
    isLoading={createResult.isLoading}
  >
    <SettingContext.Provider value={settings}>
      <RecordForm form={form} onSubmit={handleSubmit} initialValues={initialValues} />
    </SettingContext.Provider>
  </PageHeader>
}

const RecordCreateModal = ({ record, project, open, onClose, refetch, direction }) => {
  const modalContext = {
    has: true,
    params: {
      type: 'purchase',
      direction,
    },
  }
  const [form] = Form.useForm()
  return <Drawer
    title={direction === 'in' ? '采购入库' : '销售出库'}
    extra={
      <Space>
        <Button onClick={onClose} type='close'>关闭</Button>
        <Button type='primary' key='click' onClick={() => form.submit()}>保存</Button>
      </Space>
    }
    width={1024}
    open={open}
    onClose={onClose}
    onCancel={() => onClose()}>
    <ModalContext.Provider value={modalContext}>
      <RecordCreate record={record} project={project} form={form} onClose={() => { refetch(); onClose() }} />
    </ModalContext.Provider>
  </Drawer>
}

const createRecord = createModal(RecordCreateModal)
export { createRecord }

export default RecordCreate