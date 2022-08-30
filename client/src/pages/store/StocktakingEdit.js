import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Button from '@material-ui/core/Button'

import { updateTransfer, requestRecord } from '../../actions'
import PurchaseForm from './StocktakingForm'

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
      pageTitle = '盘点出库'
      stock = 'outStock'
    } else if (direction === 'in') {
      pageTitle = '盘点入库'
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
      <PurchaseForm
        title={pageTitle}
        action={<Button onClick={e => this.props.router.goBack()}>返回</Button>}
        initialValues={record}
        onSubmit={this.handleSubmit}
      />
    )
  }
}

const mapStateToProps = state => ({
  store: state.system.store,
  records: state.store.records, // Immutable Map
})

export default connect(mapStateToProps)(PurchaseEdit)
