import React, { Component } from 'react'
import { connect } from 'react-redux'
import { useParams, useMatch } from 'react-router-dom'
import moment from 'moment'

import PurchaseForm from './PurchaseForm'
import { postTransfer } from '../actions'
import { DEFAULT_STORE_TYPE } from '../utils'

const PurchaseCreate = ({ store, dispatch }) => {
  const params = useParams()
  // const match = useMatch()
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
  // if (match.pathname.startsWith('transfer_free')) {
  if (false) {
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
    return <div className="alert alert-danger">
      <p>你访问的页面不正确</p>
    </div>
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

const mapStateToProps = state => ({
  store: state.system.store
})

export default connect(mapStateToProps)(PurchaseCreate)
