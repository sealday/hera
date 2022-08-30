import React from 'react'
import { connect } from 'react-redux'
import { saveAs } from 'file-saver'
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
const key = '运输单查询公司'

class Search extends React.Component {
  search = condition => {
    this.props.dispatch(queryStore(key, {
      ...condition,
      company: true,
      hasTransport: true, // 这个里面最重要的参数
      self: this.props.store._id,
      endDate: moment(condition.endDate).add(1, 'day')
    }))
  }

  state = {
    XLSX: null,
  }

  async componentDidMount() {
    const XLSX = await import('xlsx')
    this.setState({ XLSX })
  }

  render() {
    if (!this.state.XLSX) return null
    const XLSX = this.state.XLSX
    const { records } = this.props
    return (
      <>
        <Card>
          <CardHeader
            title="运输单查询"
            action={<>
              <Button onClick={() => this.form.reset()}>重置</Button>
              <Button onClick={() => {
                const wb = XLSX.utils.table_to_book(this.table)
                const out = XLSX.write(wb, { bookType:'xlsx', bookSST:false, type:'binary', compression: true })
                const s2ab = (s) => {
                  const buf = new ArrayBuffer(s.length)
                  const view = new Uint8Array(buf)
                  for (let i=0; i !== s.length; ++i) {
                    view[i] = s.charCodeAt(i) & 0xFF
                  }
                  return buf
                }
                saveAs(new Blob([s2ab(out)],{type:"application/octet-stream"}), "运输单明细表.xlsx")
              }}>导出excel</Button>
              <Button color="primary" onClick={() => this.form.submit()}>查询</Button>
            </>}
          />
          <CardContent>
          <SearchForm
            ref={form => this.form = form}
            onSubmit={this.search}
            />
          </CardContent>
        </Card>
        <SearchTable search={records} onLoad={(table) => this.table = table} />
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
