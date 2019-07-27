import React, { Component } from 'react'
import { connect } from 'react-redux'

import TransferForm from './TransferForm'
import { postTransfer } from '../actions'

class TransferCreate extends Component {
  handleSubmit = (transfer) => {
    const { direction } = this.props.params
    if (direction === 'in') { // 入库单
      this.props.dispatch(postTransfer({
        ...transfer,
        outStock: transfer.project,
        inStock: this.props.store._id,
        type: '调拨',
      }))
    } else if (direction === 'out') { // 出库单
      this.props.dispatch(postTransfer({
        ...transfer,
        inStock: transfer.project,
        outStock: this.props.store._id,
        type: '调拨'
      }))
    }
  }

  render() {
    const { direction } = this.props.params
    let pageTitle
    if (direction === 'out') {
      pageTitle = '租赁出库'
    } else if (direction === 'in') {
      pageTitle = '租赁入库'
    } else {
      return <div className="alert alert-danger">
        <p>你访问的页面不正确</p>
      </div>
    }

    return (
      <TransferForm
        title={pageTitle}
        onSubmit={this.handleSubmit}
        direction={direction}
      />
    )
  }
}

const mapStateToProps = state => ({
  store: state.system.store
})

export default connect(mapStateToProps)(TransferCreate)
