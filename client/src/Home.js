/**
 * Created by seal on 10/01/2017.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { queryLatestOperations, queryMoreOperations } from './actions'
import moment from 'moment'

class Home extends Component {
  componentDidMount() {
    this.props.dispatch(queryLatestOperations())
  }
  render() {
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
              <td>修改</td>
              <td>{op.user.profile.name}</td>
              <td>{JSON.stringify(op.report)}</td>
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
