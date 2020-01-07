import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import PurchaseForm from './StocktakingForm'
import { postTransfer } from '../actions'

class PurchaseCreate extends Component {
  handleSubmit = (record) => {
    const { params: { direction }, store } = this.props
    if (direction === 'in') {
      this.props.dispatch(postTransfer({
        ...record,
        inStock: store._id,
        type: '盘点',
      }))
    } else if (direction === 'out') {
      this.props.dispatch(postTransfer({
        ...record,
        outStock: store._id,
        type: '盘点',
      }))
    }
  }

  render() {
    const { store, params: { direction } } = this.props
    let pageTitle
    if (direction === 'out') {
      pageTitle = '盘点出库'
    } else if (direction === 'in') {
      pageTitle = '盘点入库'
    } else {
      return <div className="alert alert-danger">
        <p>你访问的页面不正确</p>
      </div>
    }

    return (
      <PurchaseForm
        title={pageTitle}
        initialValues={{
          project: store._id,
          outDate: moment(),
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
