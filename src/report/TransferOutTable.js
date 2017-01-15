/**
 * Created by seal on 15/01/2017.
 */
import React, { Component } from 'react'
import { ajax } from '../utils'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class TransferOutTable extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'REQUEST_OUT_RECORDS', status: 'NEED_REQUEST' })
  }

  componentWillUnmount() {

  }
  render() {
    let alert = false

    if (this.props.status == 'REQUESTING') {
      alert = (
        <div className="alert alert-info">
          正在请求出库单列表，请稍后
        </div>
      )
    }

    return (
      <div>
        {alert}
        <table className="table">
          <thead>
          <tr>
            <th>项目部</th>
            <th>调拨单状态</th>
            <th>详情</th>
          </tr>
          </thead>
          <tbody>
          {this.props.records.map(record => (
            <tr key={record._id}>
              <td>{this.props.projectIdMap[record.inStock].company + this.props.projectIdMap[record.inStock].name}</td>
              <td>{record.status}</td>
              <td><Link onClick={() => {
                this.props.dispatch({ type: 'UPDATE_RECORDS_CACHE', record })
              }} to={ `transfer_order/${record._id}`}>进入详情</Link></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const bases = state.projects.filter(project => project.type == '基地仓库')
  const outStock = bases.length > 0 ? bases[0]._id : ''
  return {
    outStock,
    records: state.outRecords,
    projects: state.projects,
    projectIdMap: state.projectIdMap,
    status: state.outRecordsRequestStatus
  }
}


export default connect(mapStateToProps)(TransferOutTable)
