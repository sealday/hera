/**
 * Created by seal on 25/01/2017.
 */

import React from 'react'
import PurchaseForm from './StocktakingForm'
import { connect } from 'react-redux'
import { updateTransfer, requestRecord } from '../actions'
import moment from 'moment'

class PurchaseEdit extends React.Component {

  handleSubmit = (record) => {
    const { params: { direction }, store } = this.props
    if (direction === 'in') {
      this.props.dispatch(updateTransfer({
        ...record,
        inStock: store._id,
      }))
    } else if (direction === 'out') {
      this.props.dispatch(updateTransfer({
        ...record,
        outStock: store._id,
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
    const { records, params: { direction, id } } = this.props
    let pageTitle
    let stock
    if (direction === 'out') {
      pageTitle = '销售出库'
      stock = 'outStock'
    } else if (direction === 'in') {
      pageTitle = '采购入库'
      stock = 'inStock'
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
      outDate: moment(record.outDate),
    }

    return (
      <div>
        <button className="btn btn-default hidden-print" onClick={e => this.props.router.goBack()}>返回</button>
        <h2 className="page-header">{pageTitle}</h2>
        <PurchaseForm
          initialValues={record}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  store: state.system.store,
  records: state.store.records, // Immutable Map
})

export default connect(mapStateToProps)(PurchaseEdit);
