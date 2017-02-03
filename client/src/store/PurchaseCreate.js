/**
 * Created by seal on 25/01/2017.
 */

import React, { Component } from 'react';
import PurchaseForm from './PurchaseForm'
import { connect } from 'react-redux'
import { postTransfer } from '../actions'

class PurchaseCreate extends Component {
  handleSubmit = (transfer) => {
    const { direction } = this.props.params
    if (direction === 'in') { // 入库单
      this.props.dispatch(postTransfer({
        ...transfer,
        outStock: transfer.project,
        inStock: this.props.store._id
      }))
    } else if (direction === 'out') {
      this.props.dispatch(postTransfer({
        ...transfer,
        inStock: transfer.project,
        outStock: this.props.store._id
      }))
    }
  }

  render() {
    const { direction } = this.props.params
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
      <div>
        <h2 className="page-header">{pageTitle}</h2>
        <PurchaseForm onSubmit={this.handleSubmit}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  store: state.system.store
})

export default connect(mapStateToProps)(PurchaseCreate);
