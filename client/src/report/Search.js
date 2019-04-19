import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import SearchForm from './SearchForm'
import SearchTable from './SearchTable'
import { storeSearch } from '../actions'

class Search extends React.Component {
  search = condition => {
    this.props.dispatch(storeSearch({
      ...condition,
      endDate: moment(condition.endDate).add(1, 'day')
    }))
  }

  render() {
    return (
      <div>
        <h3 className="page-header">输入搜索条件</h3>
        <SearchForm onSubmit={this.search}/>
        <SearchTable/>
      </div>
    )
  }
}

export default connect()(Search)
