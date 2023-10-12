import React, { createRef } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { saveAs } from 'file-saver'
import { queryStore } from '../../actions'
import SearchForm from '../report/SimpleSearchForm'
import SearchTable from '../report/SimpleSearchTable'
import { PageHeader } from '../../components'
import { message } from 'antd'

const key = '仓库出入库查询公司'

class Search extends React.Component {
  constructor() {
    super()
    this.tableRef = createRef()
  }
  search = condition => {
    this.props.dispatch(
      queryStore(key, {
        ...condition,
        company: true,
        self: this.props.store._id,
        endDate: moment(condition.endDate).add(1, 'day'),
      })
    )
  }

  //导出表格
  exportExcel = XLSX => {
    const wb = XLSX.utils.table_to_book(this.tableRef)
    const out = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary',
      compression: true,
    })
    const s2ab = s => {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xff
      }
      return buf
    }
    saveAs(
      new Blob([s2ab(out)], { type: 'application/octet-stream' }),
      '财务出入库明细表.xlsx'
    )
  }

  render() {
    return (
      <PageHeader
        title="出入库查询"
        searchForm={{
          Form: SearchForm,
          onSubmit: this.search,
          onExcelExport: () => {
            import('xlsx')
              .then(XLSX => {
                this.exportExcel(XLSX)
              })
              .catch(() => {
                message.error('导出 excel 出错，请重试')
              })
          },
          isCompany: true,
        }}
      >
        <SearchTable
          search={this.props.records}
          isCompany={true}
          onLoad={table => (this.tableRef = table)}
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
