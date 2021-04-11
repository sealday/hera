import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import PurchaseForm from '../store/PurchaseForm'
import { postTransfer } from '../actions'
import { DEFAULT_STORE_TYPE } from '../utils'

/**
 * 赔偿单
 */
export const RedressCreate = () => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.system.store)
  const handleSubmit = useCallback(record => {
      dispatch(postTransfer({
        ...record,
        inStock: store._id,
        outStock: record.project,
        type: '赔偿',
      }))
  }, [dispatch, store])

  return (
    <PurchaseForm
      title="赔偿单"
      initialValues={{
        outDate: moment(),
        projectType: DEFAULT_STORE_TYPE,
        isFree: false,
      }}
      onSubmit={handleSubmit}
    />
  )
}