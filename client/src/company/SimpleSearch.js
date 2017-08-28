/**
 * Created by seal on 31/01/2017.
 */

import React from 'react'
import SearchForm from './SimpleSearchForm'
import SearchTable from './SimpleSearchTable'
import { connect } from 'react-redux'
import { queryStore } from '../actions'
import moment from 'moment'

const key = '仓库出入库查询公司'

class Search extends React.Component {
  search = condition => {
    this.props.dispatch(queryStore(key, {
      ...condition,
      company: true,
      self: this.props.store._id,
      endDate: moment(condition.endDate).add(1, 'day')
    }))
  }

  render() {
    return (
      <div>
        <h3 className="page-header">仓库出入库查询</h3>
        <SearchForm onSubmit={this.search}/>
        <SearchTable search={this.props.records} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  store: state.system.store,
  records: state.results.get(key, []),
})

export default connect(mapStateToProps)(Search)
