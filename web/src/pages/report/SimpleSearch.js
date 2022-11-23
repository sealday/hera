import React from 'react'
import { connect } from 'react-redux'
import dayjs from 'dayjs'

import SearchForm from './SimpleSearchForm'
import SearchTable from './SimpleSearchTable'
import { simpleSearch } from '../../actions'
import { PageHeader } from '../../components'

class Search extends React.Component {
  search = condition => {
    this.props.dispatch(simpleSearch({
      ...condition,
      self: this.props.store._id,
      endDate: dayjs(condition.endDate).add(1, 'day')
    }))
  }

  render() {
    return (
      <PageHeader
        title='出入库查询'
        searchForm={{
          Form: SearchForm,
          onSubmit: this.search,
          isCompany: false,
        }}
      >
        <SearchTable
          search={this.props.records}
          isCompany={false}
        />
      </PageHeader>
    )
  }
}

const mapStateToProps = state => ({
  store: state.system.store,
  records: state.store.simpleSearch,
})

export default connect(mapStateToProps)(Search)
