import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'

import SearchForm from './SimpleSearchForm'
import SearchTable from './SimpleSearchTable'
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
      <>
        <Card>
          <CardHeader
            title="出入库查询"
            action={<>
              <Button onClick={() => this.form.reset()}>重置</Button>
              <Button color="primary" onClick={() => this.form.submit()}>查询</Button>
            </>}
          />
          <CardContent>
            <SearchForm
              ref={form => this.form = form}
              onSubmit={this.search}
              isCompany={false}
            />
          </CardContent>
        </Card>
        <SearchTable
          search={this.props.records} 
          isCompany={false}
        />
      </>
    )
  }
}

const mapStateToProps = state => ({
  store: state.system.store,
  records: state.store.simpleSearch,
})

export default connect(mapStateToProps)(Search)
