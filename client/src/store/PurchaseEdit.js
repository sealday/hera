import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Button from '@material-ui/core/Button'

import { updateTransfer, requestRecord } from '../actions'
import PurchaseForm from './PurchaseForm'

class PurchaseEdit extends React.Component {

  handleSubmit = (record) => {
    const { direction } = this.props.params
    const { store } = this.props
    if (direction === 'in') { // 采购单
      this.props.dispatch(updateTransfer({
        ...record,
        inStock: store._id,
        outStock: record.project,
      }))
    } else if (direction === 'out') { // 销售单
      this.props.dispatch(updateTransfer({
        ...record,
        outStock: store._id,
        inStock: record.project,
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
    const { route, projects, records, params: { direction, id } } = this.props
    let pageTitle
    let stock
    let isFree = false
    if (route.path.startsWith('transfer_free')) {
      if (direction == 'out') {
        pageTitle = '暂存出库'
        stock = 'inStock'
      } else {
        pageTitle = '暂存入库'
        stock = 'outStock'
      }
      isFree = true
    } else if (direction === 'out') {
      pageTitle = '销售出库'
      stock = 'inStock'
    } else if (direction === 'in') {
      pageTitle = '采购入库'
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
      projectType: projects.get(record[stock]).type,
      project: record[stock],
      outDate: moment(record.outDate),
      isFree,
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
  projects: state.system.projects,
})

export default connect(mapStateToProps)(PurchaseEdit)
