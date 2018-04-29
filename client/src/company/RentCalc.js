import React from 'react'
import RentCalcForm from './RentCalcForm'
import RentCalcTable from './RentCalcTable'
import { connect } from 'react-redux'
import moment from 'moment'
import { queryRent, projectAddItem } from '../actions'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'


class RentCalc extends React.Component {
  handleSubmit = (condition) => {
    this.props.dispatch(queryRent({
      ...condition,
      endDate: moment(condition.endDate).add(1, 'day')
    }))
  }

  handleAddItem = (condition) => {
    this.props.dispatch(projectAddItem({
      ...condition,
      endDate: moment(condition.endDate).add(1, 'day')
    }))
  }

  render() {
    return (
      <div>
        <h3 className="page-header">租金计算</h3>
        <RentCalcForm
          onSubmit={this.handleSubmit}
          onAddItem={this.handleAddItem}
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
            saveAs(new Blob([s2ab(out)],{type:"application/octet-stream"}), "租金计算表.xlsx");
          }}
        />
        <RentCalcTable onLoad={(table) => this.table = table} />
      </div>
    )
  }
}

export default connect()(RentCalc)

