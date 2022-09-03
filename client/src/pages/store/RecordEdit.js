import moment from "moment"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useGetRecordQuery, useUpdateRecordMutation } from "../../api"
import { Error, Loading, PageHeader } from "../../components"
import PurchaseForm from "./PurchaseForm"
import StocktakingForm from './StocktakingForm'
import TransferForm from "./TransferForm"

export default () => {
  const { id } = useParams()
  const { data: record, error, isLoading } = useGetRecordQuery(id)
  const [updateRecord, updateResult] = useUpdateRecordMutation()
  const navigate = useNavigate()
  const store = useSelector(state => state.system.store)
  const projects = useSelector(state => state.system.projects)
  useEffect(() => {
    if (updateResult.isSuccess) {
      navigate(-1)
    }
  }, [updateResult.isSuccess])

  if (error) {
    return <Error />
  }
  if (isLoading) {
    return <Loading />
  }

  let direction = ''
  let stock
  let pageTitleSuffix = ''
  if (store._id === record.inStock) {
    direction = 'in'
    stock = 'outStock'
    pageTitleSuffix = '入库'
  } else if (store._id === record.outStock) {
    direction = 'out'
    stock = 'inStock'
    pageTitleSuffix = '出库'
  } else {
    return <Error message='暂时不支持跨仓库编辑' />
  }
  const handleSubmit = (record) => {
    if (record.type !== '盘点') {
      if (direction === 'in') {
        updateRecord({
          id, record: {
            ...record,
            inStock: store._id,
            outStock: record.project,
          }
        })
      } else if (direction === 'out') {
        updateRecord({
          id, record: {
            ...record,
            outStock: store._id,
            inStock: record.project,
          }
        })
      }
    } else {
      if (direction === 'in') {
        updateRecord({
          id, record: {
            ...record,
            inStock: store._id,
          }
        })
      } else if (direction === 'out') {
        updateRecord({
          id, record: {
            ...record,
            outStock: store._id,
          }
        })
      }
    }
  }

  let pageTitlePrefix = ''
  let isFree = false
  switch (record.type) {
    case '暂存':
      pageTitlePrefix = '暂存'
      break;
    case '购销':
      if (direction === 'in') {
        pageTitlePrefix = '采购'
      } else {
        pageTitlePrefix = '销售'
      }
      break;
    case '调拨':
      pageTitlePrefix = '租赁'
      break;
    case '盘点':
      pageTitlePrefix = '盘点'
      break;
    default:
      <Error message='暂时不支持这种形式' />
  }

  const pageTitle = pageTitlePrefix + pageTitleSuffix

  const initialValues = {
    ...record,
    projectType: projects.get(record[stock]).type,
    project: record[stock],
    outDate: moment(record.outDate),
    isFree,
  }

  let form = ''
  switch (record.type) {
    case '暂存':
      form = <PurchaseForm
        title={pageTitle}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
      break;
    case '购销':
      form = <PurchaseForm
        title={pageTitle}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
      break;
    case '调拨':
      form = <TransferForm
        title={pageTitle}
        onSubmit={handleSubmit}
        initialValues={initialValues}
      />
      break;
    case '盘点':
      form = <StocktakingForm
        title={pageTitle}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
      break;
    default:
      <Error message='暂时不支持这种形式' />
  }

  return <PageHeader
    title="订单编辑"
  >
    {form}
  </PageHeader>
}