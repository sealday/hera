import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import PurchaseForm from '../store/PurchaseForm'
import { postTransfer } from '../actions'
import { DEFAULT_STORE_TYPE } from '../utils'

/**
 * 维修单
 */
export const RepairCreate = () => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.system.store)
  const handleSubmit = useCallback(record => {
      dispatch(postTransfer({
        ...record,
        outStock: store._id,
        inStock: record.project,
        type: '维修',
      }))
  }, [dispatch, store])

  return (
    <PurchaseForm
      title="维修单"
      initialValues={{
        outDate: moment(),
        projectType: DEFAULT_STORE_TYPE,
        isFree: false,
      }}
      onSubmit={handleSubmit}
    />
  )
}