import React,{createRef} from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { saveAs } from 'file-saver'

import SearchForm from './SimpleSearchForm'
import SearchTable from './SimpleSearchTable'
import { simpleSearch } from '../../actions'
import { PageHeader } from '../../components'
import _ from 'lodash'
import { message } from 'antd'




class Search extends React.Component {

  constructor(){
    super()
    this.tableRef=createRef()
  }
  search = condition => {
    const params = {
      ...condition,
      self: this.props.store._id,
      endDate: moment(condition.endDate).add(1, 'day')
    }
    this.props.dispatch(simpleSearch(params))
  }

  //导出表格
  exportExcel = (XLSX) => {
    
    const wb = XLSX.utils.table_to_book(this.tableRef)
    const out = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary', compression: true })
    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length)
        const view = new Uint8Array(buf)
        for (let i = 0; i !== s.length; ++i) {
          view[i] = s.charCodeAt(i) & 0xFF
        }
        return buf
      }
      saveAs(new Blob([s2ab(out)], { type: "application/octet-stream" }), "出入库明细表.xlsx")
      
    }
  
  render() {
    return (
      <PageHeader
        title='出入库查询'
        searchForm={{
          Form: SearchForm,
          onExcelExport: () => {
            import('xlsx').then(XLSX => {
              this.exportExcel(XLSX)
            }).catch(() => {
              message.error('导出 excel 出错，请重试')
            })
          },
          onSubmit: this.search,
          isCompany: false,
        }}
      >
        <SearchTable
          search={this.props.records}
          isCompany={false}
          onLoad={(table) => this.tableRef= table}
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
