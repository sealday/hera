import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'

import { queryStore } from '../actions'
import SearchForm from './SimpleSearchForm'
import SearchTable from './SimpleSearchTable'

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
      <>
        <Card>
          <CardHeader
            title="仓库出入库查询"
            action={<>
              <Button onClick={() => this.form.reset()}>重置</Button>
              <Button color="primary" onClick={() => this.form.submit()}>查询</Button>
            </>}
          />
          <CardContent>
            <SearchForm onSubmit={this.search} ref={form => this.form = form}/>
          </CardContent>
        </Card>
        <SearchTable search={this.props.records} />
      </>
    )
  }
}

const mapStateToProps = state => ({
  store: state.system.store,
  records: state.results.get(key, []),
})

export default connect(mapStateToProps)(Search)
