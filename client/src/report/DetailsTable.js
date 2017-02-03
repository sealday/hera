/**
 * Created by seal on 20/01/2017.
 */
import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import { connect } from 'react-redux'

class TransferTable extends React.Component {

  getName = record => {
    const { projects, name } = this.props
    if (record.type === '采购' || record.type === '销售') {
      return record.vendor
    } else if (record.type === '调拨' && name === '出库') {
      const { company, name } = projects.get(record.outStock) || { company: '数据出错', name: '' }
      return company + name
    } else if (record.type === '调拨' && name === '入库') {
      const { company, name } = projects.get(record.inStock) || { company: '数据出错', name: '' }
      return company + name
    }
  }

  getRecords = () => {
    let records = this.props.records

    let printRecords = []
    records.forEach(record => {
      printRecords.push(record)
      record.entries.forEach(entry => {
        printRecords.push(entry)
      })
    })

    return printRecords
  }

  render() {
    const { name } = this.props
    return (
      <div>
        <table className="table table-bordered">
          <thead>
          <tr>
            <th className="text-center">单号</th>
            <th className="text-center">原始单号</th>
            <th className="text-center">时间</th>
            <th className="text-center">{name}</th>
            <th className="text-center" colSpan="3">内容</th>
            <th className="text-center">状态</th>
            <th className="text-center">制单人</th>
            <th className="text-center">制单时间</th>
            <th className="text-center">详情</th>
          </tr>
          </thead>
          <tbody>
          {this.getRecords().map((record, index) => {
            if (record.entries) {
              const rowSpan = record.entries.length + 1
              return (
                <tr key={index}>
                  <td rowSpan={rowSpan}>{record.number}</td>
                  <td rowSpan={rowSpan}>{record.originalOrder}</td>
                  <td rowSpan={rowSpan}>{moment(record.outDate).format('YYYY-MM-DD')}</td>
                  <td rowSpan={rowSpan}>{this.getName(record)}</td>
                  <th>名称</th>
                  <th>规格</th>
                  <th>数量</th>
                  <td rowSpan={rowSpan}>{record.status}</td>
                  <td rowSpan={rowSpan}>{record.username}</td>
                  <td rowSpan={rowSpan}>{moment(record.createdAt).format('YYYY-MM-DD')}</td>
                  <td rowSpan={rowSpan}>
                    <Link onClick={() => {
                      this.props.dispatch({ type: 'UPDATE_RECORDS_CACHE', record })
                    }} to={ `/transfer/${record._id}`}>详情</Link>
                    <br/>
                    {record.hasTransport && (
                    <Link onClick={() => {
                      this.props.dispatch({type: 'UPDATE_RECORDS_CACHE', record})
                    }} to={ `/transport/${record._id}`}>运输单</Link>
                      )}
                  </td>
                </tr>
              )
            } else {
              return (
                <tr key={index}>
                  <td>{record.name}</td>
                  <td>{record.size}</td>
                  <td>{record.count}</td>
                </tr>
              )
            }
          })}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapPropsToState = state => ({
  projects: state.system.projects
})

export default connect(mapPropsToState)(TransferTable)
