/**
 * Created by seal on 15/01/2017.
 */
import React from 'react'
import { connect } from 'react-redux'
import Table from './DetailsTable'
import SearchForm from './DetailsSearchForm'
import moment from 'moment'
import { queryStore } from '../actions'

const key = '采购入库明细'

class TransferOutTable extends React.Component {


  query = condition => {
    this.props.dispatch(queryStore(key, {
      ...condition,
      self: this.props.store._id,
      endDate: moment(condition.endDate).add(1, 'day')
    }))
  }

  render() {
    return (
      <div>
        <h2 className="page-header">{key}</h2>
        <SearchForm fieldname="对方单位" form={key} onSubmit={this.query}/>
        <Table name="对方单位" records={this.props.records}/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const store = state.system.store
  const records = state.results.get(key, [])

  return {
    records: records.filter(record => record.type === '采购'),
    store,
  }
}
export default connect(mapStateToProps)(TransferOutTable)
