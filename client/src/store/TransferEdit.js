/**
 * Created by seal on 25/01/2017.
 */

import React, { Component } from 'react'
import TransferForm from './TransferForm'
import { connect } from 'react-redux'
import moment from 'moment'
import Button from 'material-ui/Button'

import { updateTransfer, requestRecord } from '../actions'

class TransferCreate extends Component {
  handleSubmit = (transfer) => {
    const { direction } = this.props.params
    if (direction === 'in') { // 入库单
      this.props.dispatch(updateTransfer({
        ...transfer,
        _id: this.props.params.id,
        outStock: transfer.project,
        inStock: this.props.store._id
      }))
    } else if (direction === 'out') {
      this.props.dispatch(updateTransfer({
        ...transfer,
        _id: this.props.params.id,
        inStock: transfer.project,
        outStock: this.props.store._id
      }))
    }
  }

  componentDidMount() {
    const { records, params: { id } } = this.props
    if (!records.get(id)) {
      this.props.dispatch(requestRecord(id))
    }
  }

  render() {
    const { records, params: { direction, id }, router } = this.props
    let pageTitle
    let stock
    if (direction === 'out') {
      pageTitle = '调拨出库（发料）'
      stock = 'inStock'
    } else if (direction === 'in') {
      pageTitle = '调拨入库（收料）'
      stock = 'outStock'
    } else {
      return <div className="alert alert-danger">
        <p>你访问的页面不正确</p>
      </div>
    }

    if (!records.get(id)) {
      return <div className="alert alert-info">
        <p>加载中！</p>
      </div>
    }

    let record = records.get(id)
    record = {
      ...record,
      project: record[stock],
      outDate: moment(record.outDate)
    }

    return (
      <div>
        <div className="hidden-print" style={{ display: 'flex' }}>
          <h2 className="page-header" style={{ flex: 1 }}>{pageTitle}</h2>
          <span><Button onClick={() => router.goBack()}>返回</Button></span>
        </div>
        <TransferForm
          onSubmit={this.handleSubmit}
          initialValues={record}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  store: state.system.store,
  records: state.store.records, // Immutable Map
})

export default connect(mapStateToProps)(TransferCreate);
