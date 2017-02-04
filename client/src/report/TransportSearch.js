/**
 * Created by seal on 31/01/2017.
 */

import React from 'react'
import SearchForm from './TransportSearchForm'
import SearchTable from './TransportSearchTable'
import { connect } from 'react-redux'
import { queryStore } from '../actions'
import moment from 'moment'

const key = '运输单查询'

class Search extends React.Component {
  search = condition => {
    this.props.dispatch(queryStore(key, {
      ...condition,
      hasTransport: true, // 这个里面最重要的参数
      self: this.props.store._id,
      endDate: moment(condition.endDate).add(1, 'day')
    }))
  }

  render() {
    const { records } = this.props
    return (
      <div>
        <h3 className="page-header">运输单查询</h3>
        <SearchForm onSubmit={this.search}/>
        <SearchTable search={records} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const store = state.system.store
  const records = state.results.get(key, [])
  return {
    records,
    store,
  }
}

export default connect(mapStateToProps)(Search)
