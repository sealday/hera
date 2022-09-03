import { useDispatch, useSelector } from 'react-redux'
import { useParams, useMatch, useNavigate } from 'react-router-dom'
import moment from 'moment'

import PurchaseForm from './PurchaseForm'
import { postTransfer } from '../../actions'
import { DEFAULT_STORE_TYPE } from '../../utils'
import { Error } from '../../components'

export default () => {
  const store = useSelector(state => state.system.store)
  const dispatch = useDispatch()
  const params = useParams()
  const match = useMatch('/transfer_free/*')
  const direction = params.direction
  const handleSubmit = (record) => {
    if (direction === 'in') { // 采购单
      dispatch(postTransfer({
        ...record,
        inStock: store._id,
        outStock: record.project,
        type: record.isFree ? '暂存' : '购销',
      }))
    } else if (direction === 'out') { // 销售单
      dispatch(postTransfer({
        ...record,
        outStock: store._id,
        inStock: record.project,
        type: record.isFree ? '暂存' : '购销',
      }))
    }
  }

  let pageTitle
  let isFree = false
  if (match) {
    if (direction === 'out') {
      pageTitle = '暂存出库'
    } else {
      pageTitle = '暂存入库'
    }
    isFree = true
  } else if (direction === 'out') {
    pageTitle = '销售出库'
  } else if (direction === 'in') {
    pageTitle = '采购入库'
  } else {
    return <Error />
  }

  return (
    <PurchaseForm
      title={pageTitle}
      initialValues={{
        outDate: moment(),
        projectType: DEFAULT_STORE_TYPE,
        isFree,
      }}
      onSubmit={handleSubmit}
    />
  )
}