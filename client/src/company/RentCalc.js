import React from 'react'
import RentCalcForm from './RentCalcForm'
import RentCalcTable from './RentCalcTable'
import { connect } from 'react-redux'
import moment from 'moment'
import { queryRent, projectAddItem } from '../actions'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { RENT } from '../actions'
import { dateFormat } from '../utils'


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
    const { rent } = this.props
    return (
      <div>
        <h3 className="page-header">租金计算</h3>
        <RentCalcForm
          onSubmit={this.handleSubmit}
          onAddItem={this.handleAddItem}
          onExcelExport={() => {
            const wb = XLSX.utils.book_new();

            const json = [[
              '日期', '出入库', '名称', '规格', '单位', '数量', '单价', '天数', '金额', '运费'
            ]]
            for (const item of rent.history) {
              json.push([
                '上期结存', null, item.name, '', item.unit,
                item.count, item.unitPrice || 0, item.days, item.price, 0
              ])
            }
            for (const item of rent.list) {
              json.push([
                dateFormat(item.outDate), item.inOut, item.name, item.size, item.unit,
                item.count, item.unitPrice || 0, item.days, item.price, item.freight || 0
              ])
            }
            const sheet = XLSX.utils.aoa_to_sheet(json)
            const range = XLSX.utils.decode_range(sheet['!ref'])

            // 数量 5
            // 单价 6
            // 金额 8
            // 运费 9
            for(let C = range.s.c; C <= range.e.c; ++C) {
              let format
              switch (C) {
                case 5:
                  format = '#,##0.00_ ;-#,##0.00'
                  break
                case 6:
                  format = '#,##0.0000_ '
                  break
                case 8:
                  format = '#,##0.00_ ;[red]-#,##0.00'
                  break
                case 9:
                  format = '#,##0.00_ ;-#,##0.00'
                  break
                default:
                  continue
              }
              for(let R = range.s.r; R <= range.e.r; ++R) {
                if (R === 0) continue;
                const cell_address = {c:C, r:R};
                const cell_ref = XLSX.utils.encode_cell(cell_address);
                if (sheet[cell_ref]) {
                  sheet[cell_ref] = XLSX.utils.cell_set_number_format(sheet[cell_ref], format)
                }
              }
            }
            XLSX.utils.book_append_sheet(wb, sheet, '租金计算表')
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

