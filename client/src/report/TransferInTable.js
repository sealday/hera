/**
 * Created by seal on 15/01/2017.
 */
import React from 'react'
import { connect } from 'react-redux'
import Table from './DetailsTable'
import SearchForm from './DetailsSearchForm'
import moment from 'moment'
import { queryStore } from '../actions'

class TransferOutTable extends React.Component {

  query = condition => {
    this.props.dispatch(queryStore('调拨入库明细', {
      ...condition,
      self: this.props.store._id,
      endDate: moment(condition.endDate).add(1, 'day')
    }))
  }

  render() {
    return (
      <div>
        <h2 className="page-header">调拨入库明细</h2>
        <SearchForm fieldname="出库" form="调拨出库明细" onSubmit={this.query}/>
        <Table name="出库" records={this.props.records}/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const store = state.system.store
  const records = state.results.get('调拨入库明细', [])

  return {
    records: records.filter(record => record.inStock === store._id && record.type === '调拨'),
    store,
  }
}
export default connect(mapStateToProps)(TransferOutTable)
