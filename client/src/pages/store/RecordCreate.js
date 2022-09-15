import _ from 'lodash'
import { Form } from "antd"
import moment from "moment"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useCreateRecordMutation } from "../../api"
import { Error, PageHeader } from "../../components"
import { RECORD_TYPE_MAP } from "../../globals"
import { DEFAULT_STORE_TYPE } from "../../utils"
import RecordForm from "./RecordForm"
import { SettingContext } from "./records"

export default () => {
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const [createRecord, createResult] = useCreateRecordMutation()
  const navigate = useNavigate()
  const type = searchParams.get('type')
  const direction = searchParams.get('direction')
  const store = useSelector(state => state.system.store)
  // 创建结果
  useEffect(() => {
    if (createResult.isSuccess) {
      navigate(`/record/${createResult.data._id}`)
    }
  }, [navigate, createResult.isSuccess])
  // 提交处理
  const handleSubmit = (record) => {
    record.entries = _.map(record.entries, item => ({
      ...item,
      ..._.zipObject(['type', 'name', 'size'], item.product),
    }))
    record.complements = _.map(record.complements, item => {
      const complement = {
        ...item,
        product: _.zipObject(['type', 'name', 'size'], item.product),
      }
      if (item.level === 'associated') {
        const associateArray = JSON.parse(item.associate)
        complement.associate = _.zipObject(['type', 'name', 'size'], associateArray)
      }
      return complement
    })
    if (type === 'check') {
      createRecord({
        ...record,
        inStock: store._id,
        type: RECORD_TYPE_MAP[type],
      })
      return
    }
    if (direction === 'in') {
      createRecord({
        ...record,
        inStock: store._id,
        outStock: record.projectId,
        type: RECORD_TYPE_MAP[type],
      })
    } else if (direction === 'out') {
      createRecord({
        ...record,
        outStock: store._id,
        inStock: record.projectId,
        type: RECORD_TYPE_MAP[type],
      })
    }
  }

  const titleParts = []
  const settings = {
    price: false,
    project: true,
    originalOrder: true,
    carNumber: true,
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
      break;
    case 'check':
      titleParts.push('盘点录入')
      settings.project = false
      settings.originalOrder = false
      settings.carNumber = false
      break;
    default:
      <Error>不支持的类型</Error>
  }
  // 名称后缀
  titleParts.push(direction === 'in' ? '入库' : direction === 'out' ? '出库' : '')
  const pageTitle = titleParts.join('')
  const initialValues = {
    outDate: moment(),
    type: DEFAULT_STORE_TYPE,
  }
  return <PageHeader
    title={pageTitle}
    onSave={() => form.submit()}
  >
    <SettingContext.Provider value={settings}>
      <RecordForm form={form} onSubmit={handleSubmit} initialValues={initialValues} type={type} />
    </SettingContext.Provider>
  </PageHeader>
}