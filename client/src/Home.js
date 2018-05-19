/**
 * Created by seal on 10/01/2017.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { queryLatestOperations, queryMoreOperations } from './actions'
import moment from 'moment'

const styles = {
  diffAdd: {
    backgroundColor: '#97f295',
    padding: '2px',
  },
  diffRemove: {
    backgroundColor: '#ffb6ba',
    padding: '2px',
  }
}

class Home extends Component {
  componentDidMount() {
    this.props.dispatch(queryLatestOperations())
  }
  renderReport(report) {
    const items = []
    const nameMap = {
      outStock: '出库',
      inStock: '入库',
      vendor: '第三方',
      originalOrder: '原始单号',
      carNumber: '车号',
      carFee: '运费',
      sortFee: '整理费用',
      other1Fee: '其他费用1',
      other2Fee: '其他费用2',
      comments: '备注',
    }
    let entries = report.recordEdit || []
    entries.forEach((diff) => {
      items.push(<p key={diff.field}>
        <span>{nameMap[diff.field]}：</span>
        { diff.old && <span style={styles.diffRemove}>{JSON.stringify(diff.old)}</span> }
        { diff.new && <span style={styles.diffAdd}>{JSON.stringify(diff.new)}</span> }
      </p>)
    })
    entries = report.entryAdd || []
    entries.forEach((entry) => {
      items.push(<p key={entry.field}
      ><span style={styles.diffAdd}>{entry.new.name} | {entry.new.size} | {entry.new.count}</span></p>)
    })
    entries = report.entryRemove || []
    entries.forEach((entry) => {
      items.push(<p key={entry.field}
      ><span style={styles.diffRemove}>{entry.old.name} | {entry.old.size} | {entry.old.count}</span></p>)
    })
    entries = report.entryEdit || []
    entries.forEach((entry) => {
      items.push(<p key={entry.field}>
        <span style={styles.diffRemove}>{entry.old.name} | {entry.old.size} | {entry.old.count}</span>
        <i className="glyphicon glyphicon-triangle-right" />
        <span style={styles.diffAdd}>{entry.new.name} | {entry.new.size} | {entry.new.count}</span>
      </p>)
    })

    return items
  }
  render() {
    if (this.props.system.user.role  !== '系统管理员') {
      return null
    }
    return (
      <div>
        <h2 className="page-header">近期操作记录</h2>
        <div className="panel panel-default">
          <div className="panel-body">
            <button className="btn btn-primary" onClick={() => {
              this.props.dispatch(queryLatestOperations())
            }}>刷新</button>
          </div>
        </div>
        <table className="table table-bordered">
          <thead>
          <tr>
            <th>操作时间</th>
            <th>操作类型</th>
            <th>操作人</th>
            <th>修改内容</th>
          </tr>
          </thead>
          <tbody>
          {this.props.operations.map((op) => (
            <tr key={op._id}>
              <td>{moment(op.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</td>
              <td>{op.type || '修改'}</td>
              <td>{op.user.username}</td>
              <td>
                <p key="number">单号：{op.report.number}</p>
                {this.renderReport(op.report)}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        <div className="panel panel-default">
          <div className="panel-body">
            <button className="btn btn-primary" onClick={() => {
              const ops = this.props.operations
              if (ops.length > 0) {
                this.props.dispatch(queryMoreOperations(ops[ops.length - 1]._id))
              }
            }}>继续加载</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  system: state.system,
  operations: state.results.get('operations', []),
})

export default connect(mapStateToProps)(Home);
