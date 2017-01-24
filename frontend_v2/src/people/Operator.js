/**
 * Created by seal on 14/01/2017.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux'

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
          </tr>
          </thead>
          <tbody>
          {this.props.users.map(user => (
            <tr>
              <td>{user.username}</td>
              <td>******</td>
              <td>{user.profile.name}</td>
              <th>{user.projects.map(projectId => (
                <p>{projectId}</p>
              ))}</th>
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
    users: state.users
  }
}

export default connect(mapStateToProps)(Operator);