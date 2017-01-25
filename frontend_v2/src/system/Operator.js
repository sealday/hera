/**
 * Created by seal on 14/01/2017.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router'

class Operator extends Component {
  render() {
    return (
      <div>
        <h2>操作员列表</h2>
        <table className="table">
          <thead>
          <tr>
            <th>用户名</th>
            <th>密码</th>
            <th>姓名</th>
            <th>项目权限</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          {this.props.users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>******</td>
              <td>{user.profile.name}</td>
              <td>{user.projects.map(projectId => (
                <p key={projectId}>{projectId}</p>
              ))}</td>
              <td>
                <Link to={`/operator/${user._id}/edit`}>编辑</Link>
                <br />
                <Link to="">删除</Link>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.system.users.valueSeq()
  }
}

export default connect(mapStateToProps)(Operator);