import React from 'react'
import RentCalcForm from './RentCalcForm'
import RentCalcTable from './RentCalcTable'
import { connect } from 'react-redux'
import moment from 'moment'
import { queryRent } from '../actions'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { RENT } from '../actions'


class RentCalc extends React.Component {
  handleSubmit = (condition) => {
    this.props.dispatch(queryRent({
      ...condition,
      endDate: moment(condition.endDate).add(1, 'day')
    }))
  }

  render() {
    const { rent } = this.props
    return (
      <div>
        <h3 className="page-header">租金计算</h3>
        <RentCalcForm
          onSubmit={this.handleSubmit}
          onExcelExport={() => {
            const wb = XLSX.utils.table_to_book(this.table)
            for (const sheetName of wb.SheetNames) {
              const sheet = wb.Sheets[sheetName]
              for (const i in sheet) {
                if (sheet[i] && sheet[i].t === 's') {
                  sheet[i].v = sheet[i].v.replace('￥', '')
                }
              }
            }
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

const mapStateToProps = state => ({
  rent: state.results.get(RENT, { history: [], list: [], group: [ { price: 0, freight: 0 } ] })
})

export default connect(mapStateToProps)(RentCalc)

