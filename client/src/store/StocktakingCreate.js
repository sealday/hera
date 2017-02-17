/**
 * Created by seal on 25/01/2017.
 */

import React, { Component } from 'react';
import PurchaseForm from './StocktakingForm'
import { connect } from 'react-redux'
import { postTransfer } from '../actions'
import moment from 'moment'

class PurchaseCreate extends Component {
  handleSubmit = (record) => {
    const { params: { direction }, store } = this.props
    if (direction === 'in') {
      this.props.dispatch(postTransfer({
        ...record,
        inStock: store._id,
        type: '盘点入库',
      }))
    } else if (direction === 'out') {
      this.props.dispatch(postTransfer({
        ...record,
        outStock: store._id,
        type: '盘点出库',
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
      <div>
        <h2 className="page-header">{pageTitle}</h2>
        <PurchaseForm
          initialValues={{
            project: store._id,
            outDate: moment(),
          }}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  store: state.system.store
})

export default connect(mapStateToProps)(PurchaseCreate);
