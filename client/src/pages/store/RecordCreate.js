import moment from "moment"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useCreateRecordMutation } from "../../api"
import { Error, PageHeader } from "../../components"
import { RECORD_TYPE_MAP } from "../../globals"
import { DEFAULT_STORE_TYPE } from "../../utils"
import PurchaseForm from "./PurchaseForm"
import StocktakingForm from './StocktakingForm'
import TransferForm from "./TransferForm"

export default () => {
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
      console.dir(createResult)
    }
  }, [createResult.isSuccess])
  // 名称后缀
  let pageTitleSuffix = ''
  if (direction == 'in') {
    pageTitleSuffix = '入库'
  } else if (direction == 'out') {
    pageTitleSuffix = '出库'
  } else {
    return <Error message='不支持的操作' />
  }
  const handleSubmit = (record) => {
    if (type !== 'check') {
      if (direction === 'in') {
        createRecord({
          ...record,
          inStock: store._id,
          outStock: record.project,
          type: RECORD_TYPE_MAP[type],
        })
      } else if (direction === 'out') {
        createRecord({
          ...record,
          outStock: store._id,
          inStock: record.project,
          type: RECORD_TYPE_MAP[type],
        })
      }
    } else {
      if (direction === 'in') {
        createRecord({
          ...record,
          inStock: store._id,
          type: RECORD_TYPE_MAP[type],
        })
      } else if (direction === 'out') {
        createRecord({
          ...record,
          outStock: store._id,
          type: RECORD_TYPE_MAP[type],
        })
      }
    }
  }

  let pageTitlePrefix = ''
  let isFree = false
  switch (type) {
    case 'transfer':
      isFree = true
      pageTitlePrefix = '暂存'
      break;
    case 'purchase':
      if (direction === 'in') {
        pageTitlePrefix = '采购'
      } else {
        pageTitlePrefix = '销售'
      }
      break;
    case 'rent':
      pageTitlePrefix = '租赁'
      break;
    case 'check':
      pageTitlePrefix = '盘点'
      break;
    default:
      <Error message='暂时不支持这种形式' />
  }

  const pageTitle = pageTitlePrefix + pageTitleSuffix
  const initialValues = {
    outDate: moment(),
    projectType: DEFAULT_STORE_TYPE,
    isFree,
  }

  let form = ''
  switch (type) {
    case 'transfer':
      form = <PurchaseForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
      break;
    case 'purchase':
      form = <PurchaseForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
      break;
    case 'rent':
      form = <TransferForm
        onSubmit={handleSubmit}
        initialValues={initialValues}
      />
      break;
    case 'check':
      form = <StocktakingForm
        initialValues={{ ...initialValues, project: store._id }}
        onSubmit={handleSubmit}
      />
      break;
    default:
      <Error message='暂时不支持这种形式' />
  }

  return <PageHeader
    title={pageTitle}
    subTitle='创建'
  >
    {form}
  </PageHeader>
}