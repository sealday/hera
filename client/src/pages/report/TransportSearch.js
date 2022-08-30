import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'

import SearchForm from './TransportSearchForm'
import SearchTable from './TransportSearchTable'
import { queryStore } from '../../actions'
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
      <>
        <Card>
          <CardHeader
            title="运输单查询"
            action={<>
              <Button onClick={() => this.form.reset()}>重置</Button>
              <Button color="primary" onClick={() => this.form.submit()}>查询</Button>
            </>}
          />
          <CardContent>
            <SearchForm
              onSubmit={this.search}
              ref={form => this.form = form}
            />
          </CardContent>
        </Card>
        <SearchTable search={records} />
      </>
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
