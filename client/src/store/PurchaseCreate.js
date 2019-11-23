import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import PurchaseForm from './PurchaseForm'
import { postTransfer } from '../actions'

class PurchaseCreate extends Component {
  handleSubmit = (record) => {
    const { direction } = this.props.params
    const { store } = this.props
    if (direction === 'in') { // 采购单
      this.props.dispatch(postTransfer({
        ...record,
        inStock: store._id,
        outStock: record.project,
        type: '采购',
      }))
    } else if (direction === 'out') { // 销售单
      this.props.dispatch(postTransfer({
        ...record,
        outStock: store._id,
        inStock: record.project,
        type: '销售',
      }))
    }
  }

  render() {
    const { store, params: { direction } } = this.props
    let pageTitle
    if (direction === 'out') {
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
          projectType: '项目部仓库',
        }}
        onSubmit={this.handleSubmit}
      />
    )
  }
}

const mapStateToProps = state => ({
  store: state.system.store
})

export default connect(mapStateToProps)(PurchaseCreate)
