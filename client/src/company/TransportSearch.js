import React from 'react'
import SearchForm from './TransportSearchForm'
import SearchTable from './TransportSearchTable'
import { connect } from 'react-redux'
import { queryStore } from '../actions'
import { saveAs } from 'file-saver'
import moment from 'moment'
import XLSX from 'xlsx'

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

  render() {
    const { records } = this.props
    return (
      <div>
        <h3 className="page-header">运输单查询</h3>
        <SearchForm
          onSubmit={this.search}
          onExcelExport={() => {
            const wb = XLSX.utils.table_to_book(this.table)
            const out = XLSX.write(wb, { bookType:'xlsx', bookSST:false, type:'binary', compression: true })
            const s2ab = (s) => {
              const buf = new ArrayBuffer(s.length)
              const view = new Uint8Array(buf)
              for (let i=0; i !== s.length; ++i) {
                view[i] = s.charCodeAt(i) & 0xFF
              }
              return buf;
            }
            saveAs(new Blob([s2ab(out)],{type:"application/octet-stream"}), "运输单明细表.xlsx");
          }}/>
        <SearchTable search={records} onLoad={(table) => this.table = table} />
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
