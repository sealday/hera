import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { queryStore } from '../../actions'
import SearchForm from '../report/SimpleSearchForm'
import SearchTable from '../report/SimpleSearchTable'
import { PageHeader } from '../../components'

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
      <PageHeader
        title='出入库查询'
        searchForm={{
          Form: SearchForm,
          onSubmit: this.search,
          isCompany: true,
        }}
      >
        <SearchTable
          search={this.props.records}
          isCompany={true}
        />
      </PageHeader>
    )
  }
}

const mapStateToProps = state => ({
  store: state.system.store,
  records: state.results.get(key, []),
})

export default connect(mapStateToProps)(Search)
