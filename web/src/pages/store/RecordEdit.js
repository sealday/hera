import _ from 'lodash'
import { Form } from "antd"
import moment from "moment"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "utils/hooks"
import heraApi, { useGetRecordQuery, useUpdateRecordMutation } from "../../api"
import { Error, Loading, PageHeader } from "../../components"
import RecordForm from './RecordForm/index'
import { SettingContext } from "./records"
import { useDirection } from './Record'
import { strings } from 'hera-core'

export default () => {
  const [form] = Form.useForm()
  const { id } = useParams()
  const { data: record, error, isLoading } = useGetRecordQuery(id)
  const [updateRecord, updateResult] = useUpdateRecordMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useSelector(state => state.system.store)
  const getProjectListAll = heraApi.useGetProjectListAllQuery()
  const direction = useDirection(record)
  useEffect(() => {
    if (updateResult.isSuccess) {
      if (updateResult.data.associated) {
         dispatch(heraApi.invalidateRecord(updateResult.data.associated))
      }
      navigate(-1)
    }
  }, [navigate, updateResult.isSuccess])

  if (error || getProjectListAll.isError) {
    return <Error />
  }
  if (isLoading || getProjectListAll.isLoading) {
    return <Loading />
  }
  const type = record.type
  const handleSubmit = (record) => {
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
    record.type = type
    if (type === '盘点') {
      updateRecord({
        id, record: {
          ...record,
          inStock: store._id,
        }
      })
      return
    }
    if (direction === 'in') {
      updateRecord({
        id, record: {
          ...record,
          inStock: store._id,
          outStock: record.projectId,
        }
      })
    } else if (direction === 'out') {
      updateRecord({
        id, record: {
          ...record,
          outStock: store._id,
          inStock: record.projectId,
        }
      })
    }
  }
  const settings = {
    price: false,
    project: true,
    originalOrder: true,
    carNumber: true,
    weight: true,
    freight: false,
  }
  if (!direction) {
    return <Error message='不支持' />
  }
  const titleParts = []
  switch (type) {
    case '暂存':
      titleParts.push('暂存')
      break;
    case '购销':
      titleParts.push(direction === 'in' ? '采购' : '销售')
      settings.price = true
      break;
    case strings.quickMapping.TRANSFER:
      titleParts.push('租赁')
      settings.freight = true
      break;
    case '盘点':
      titleParts.push('盘点录入')
      settings.project = false
      settings.originalOrder = false
      settings.carNumber = false
      settings.weight = false
      break;
    default:
      return <Error message='暂时不支持这种形式' />
  }
  const initialValues = {
    ...record,
    outDate: moment(record.outDate),
    entries: _.map(record.entries, item => ({
      ...item,
      product: [item.type, item.name, item.size],
    })),
    complements: _.map(record.complements, item => {
      const complement = {
        ...item,
      }
      if (item.level === 'associated') {
        complement.associate = JSON.stringify([item.associate.type, item.associate.name, item.associate.size])
      }
      return complement
    })
  }
  if (type === '盘点') {
    // nothing
  } else if (direction === 'in') {
    initialValues.projectId = record.outStock._id
    initialValues.type = record.outStock.type
    titleParts.push('入库')
  } else {
    initialValues.projectId = record.inStock._id
    initialValues.type = record.inStock.type
    titleParts.push('出库')
  }
  const pageTitle = titleParts.join('')
  return <PageHeader
    title={pageTitle}
    subTitle='正在编辑'
    onSave={() => form.submit()}
  >
    <SettingContext.Provider value={settings}>
      <RecordForm form={form} onSubmit={handleSubmit} initialValues={initialValues} />
    </SettingContext.Provider>
  </PageHeader>
}