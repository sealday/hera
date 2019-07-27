import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'
import {
  Popconfirm,
} from 'antd'
import 'antd/lib/popconfirm/style/css'

import { deleteOperator } from '../actions'

class Operator extends Component {
  render() {
    return (
      <Card>
        <CardHeader
          title="用户管理"
          action={<>
            <Button component={Link} to="/operator/create" color="primary">新增</Button>
          </>}
        />
        <CardContent>
          <table className="table table-bordered" style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead>
            <tr>
              <th>用户名</th>
              <th>姓名</th>
              <th>角色</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            {this.props.users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.profile.name}</td>
                <td>{user.role}</td>
                <td>{user.comments}</td>
                <td>
                  <Link to={`/operator/${user._id}/edit`}>编辑</Link>
                  <Popconfirm
                    title={`确定要删除用户 ${user.username}`}
                    onConfirm={() => this.props.dispatch(deleteOperator(user))}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Link>删除</Link>
                  </Popconfirm>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    )
  }
}

const mapStateToProps = state => {
  return {
    users: state.system.users.valueSeq()
  }
}

export default connect(mapStateToProps)(Operator);
