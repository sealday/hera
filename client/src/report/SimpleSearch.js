import React from 'react'
import SearchForm from './SimpleSearchForm'
import SearchTable from './SimpleSearchTable'
import { connect } from 'react-redux'
import moment from 'moment'

import { simpleSearch } from '../actions'

class Search extends React.Component {
  search = condition => {
    this.props.dispatch(simpleSearch({
      ...condition,
      self: this.props.store._id,
      endDate: moment(condition.endDate).add(1, 'day')
    }))
  }

  render() {
    return (
      <div>
        <h3 className="page-header">仓库出入库查询</h3>
        <SearchForm onSubmit={this.search}/>
        <SearchTable/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  store: state.system.store
})

export default connect(mapStateToProps)(Search)
