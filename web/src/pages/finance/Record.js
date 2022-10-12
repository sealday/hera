/**
 * Created by seal on 04/02/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { requestRecord } from '../../actions'
import moment from 'moment'

class Record extends React.Component {

  getProjectName = id => {
    const { projects } = this.props
    const project = projects.get(id)
    return project ? project.company + project.name : '';
  }

  componentDidMount() {
    const { id, records } = this.props
    const record = records.get(id)

    if (!record) {
      this.props.dispatch(requestRecord(id))
    }
  }

  render() {
    const { id, records, router } = this.props
    const record = records.get(id)

    // 假设本地缓存中没有则进行一次网络请求
    if (!record) {
      return (
        <div className="alert alert-info">
          <p>请求数据中，请稍后</p>
        </div>
      )
    }
    return (
      <div>
        <h2 className="page-header">订单详情</h2>
        <div className="panel panel-default">
          <div className="panel-body">
            <div>出库： {this.getProjectName(record.outStock) || record.vendor}</div>
            <div>入库： {this.getProjectName(record.inStock) || record.vendor}</div>
            <div>时间：{moment(record.outDate).format('YYYY-MM-DD')}</div>
            <div>车号：{record.carNumber}</div>
            <div>单号：{record.number}</div>
            <div>原始单号：{record.originalOrder}</div>
            <div>制单人：{record.username}</div>
            <div className="btn-group" style={{ marginTop: 8 }}>
              <button className="btn btn-default" onClick={() => alert('还没有实现')}>打印</button>
              <button className="btn btn-default" onClick={() => alert('还没有实现')}>编辑</button>
              <button className="btn btn-default" onClick={() => router.push(`/transport/${record._id}`)}>运输单</button>
            </div>
          </div>
        </div>
        <table className="table table-bordered">
          <thead>
          <tr>
            <th>类型</th>
            <th>名称</th>
            <th>规格</th>
            <th>数量</th>
          </tr>
          </thead>
          <tbody>
          {record.entries.map((entry) => (
            <tr key={entry._id}>
              <td>{entry.type}</td>
              <td>{entry.name}</td>
              <td>{entry.size}</td>
              <td>{entry.count}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  records: state.store.records,
  projects: state.system.projects,
  store: state.system.store,
  id: props.params.id
})

export default connect(mapStateToProps)(Record)
