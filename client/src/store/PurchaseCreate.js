/**
 * Created by seal on 25/01/2017.
 */

import React, { Component } from 'react';
import PurchaseForm from './PurchaseForm'
import { connect } from 'react-redux'
import { postTransfer } from '../actions'
import moment from 'moment'

class PurchaseCreate extends Component {
  handleSubmit = (record) => {
    const { direction } = this.props.params
    if (direction === 'in') { // 采购单
      this.props.dispatch(postTransfer({
        ...record,
        inStock: record.project,
        type: '采购',
      }))
    } else if (direction === 'out') { // 销售单
      this.props.dispatch(postTransfer({
        ...record,
        outStock: record.project,
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
