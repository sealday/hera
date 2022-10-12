import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveAs } from 'file-saver'
import moment from 'moment'

import SearchForm from './TransportSearchForm'
import SearchTable from './TransportSearchTable'
import { queryStore } from '../../actions'
import { PageHeader } from '../../components'
import { message } from 'antd'

const key = '运输单查询公司'
export default () => {

  const dispatch = useDispatch()
  const tableRef = useRef()
  const { store, records } = useSelector(state => ({
    records: state.results.get(key, []),
    store: state.system.store,
  }))
  const search = condition => {
    dispatch(queryStore(key, {
      ...condition,
      company: true,
      hasTransport: true, // 这个里面最重要的参数
      self: store._id,
      endDate: moment(condition.endDate).add(1, 'day')
    }))
  }

  const exportExcel = (XLSX) => {
    const wb = XLSX.utils.table_to_book(tableRef.current)
    const out = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary', compression: true })
    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF
      }
      return buf
    }
    saveAs(new Blob([s2ab(out)], { type: "application/octet-stream" }), "运输单明细表.xlsx")
  }

  return (
    <PageHeader
      title='运输单查询'
      searchForm={{
        Form: SearchForm,
        onSubmit: search,
        onExcelExport: () => {
          import('xlsx').then(XLSX => {
            exportExcel(XLSX)
          }).catch(() => {
            message.error('导出 excel 出错，请重试')
          })
        }
      }}
    >
      <SearchTable search={records} onLoad={(table) => tableRef.current = table} />
    </PageHeader>
  )
}