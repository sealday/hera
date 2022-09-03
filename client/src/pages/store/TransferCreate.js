import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TransferForm from './TransferForm'
import { postTransfer } from '../../actions'
import { useParams } from 'react-router-dom'
import { Error } from '../../components'

export default () => {
  const store = useSelector(state => state.system.store)
  const { direction } = useParams()
  const dispatch = useDispatch()
  const handleSubmit = (transfer) => {
    if (direction === 'in') { // 入库单
      dispatch(postTransfer({
        ...transfer,
        outStock: transfer.project,
        inStock: store._id,
        type: '调拨',
      }))
    } else if (direction === 'out') { // 出库单
      dispatch(postTransfer({
        ...transfer,
        inStock: transfer.project,
        outStock: store._id,
        type: '调拨'
      }))
    }
  }

  let pageTitle
  if (direction === 'out') {
    pageTitle = '租赁出库'
  } else if (direction === 'in') {
    pageTitle = '租赁入库'
  } else {
    return <Error />
  }

  return (
    <TransferForm
      title={pageTitle}
      onSubmit={handleSubmit}
      direction={direction}
    />
  )
}