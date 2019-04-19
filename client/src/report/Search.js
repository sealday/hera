import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'

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
      <Card>
        <CardHeader
          title="明细检索"
          action={<>
            <Button onClick={() => this.form.reset()}>重置</Button>
            <Button color="primary" onClick={() => this.form.submit()}>查询</Button>
          </>}
        />
        <CardContent>
          <SearchForm
            ref={form => this.form = form}
            onSubmit={this.search}
          />
          <SearchTable/>
        </CardContent>
      </Card>
    )
  }
}

export default connect()(Search)
