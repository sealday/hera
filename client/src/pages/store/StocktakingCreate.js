import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import PurchaseForm from './StocktakingForm'
import { postTransfer } from '../../actions'
import { useParams } from 'react-router-dom'
import { Error } from '../../components'

export default () => {
  const store = useSelector(state => state.system.store)
  const { direction }= useParams()
  const dispatch = useDispatch()
  const handleSubmit = (record) => {
    if (direction === 'in') {
      dispatch(postTransfer({
        ...record,
        inStock: store._id,
        type: '盘点',
      }))
    } else if (direction === 'out') {
      dispatch(postTransfer({
        ...record,
        outStock: store._id,
        type: '盘点',
      }))
    }
  }

  let pageTitle
  if (direction === 'out') {
    pageTitle = '盘点出库'
  } else if (direction === 'in') {
    pageTitle = '盘点入库'
  } else {
    return <Error />
  }

  return (
    <PurchaseForm
      title={pageTitle}
      initialValues={{
        project: store._id,
        outDate: moment().toDate(),
      }}
      onSubmit={handleSubmit}
    />
  )
}