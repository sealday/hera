/**
 * Created by seal on 25/01/2017.
 */

import React, { Component } from 'react';
import TransferForm from './TransferForm'
import { connect } from 'react-redux'
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
      pageTitle = '调拨出库（发料）'
    } else if (direction === 'in') {
      pageTitle = '调拨入库（收料）'
    } else {
      return <div className="alert alert-danger">
        <p>你访问的页面不正确</p>
      </div>
    }

    return (
      <div>
        <h2 className="page-header">{pageTitle}</h2>
        <TransferForm onSubmit={this.handleSubmit} direction={direction}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  store: state.system.store
})

export default connect(mapStateToProps)(TransferCreate);
