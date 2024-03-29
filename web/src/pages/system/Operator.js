import React from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'utils/hooks'
import {
  Button,
  Popconfirm,
  Space,
} from 'antd'
import { Link, PageHeader, ResultTable } from 'components'
import { deleteOperator } from '../../actions'

const Operator = ({ users, dispatch }) => {
  const navigate = useNavigate()
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: ['profile', 'name'],
      key: 'profile.name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '备注',
      dataIndex: 'comments',
      key: 'comments',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, user) => {
        return <Space size='middle'>
          <Link to={`/operator/${user._id}/edit`}>编辑</Link>
          <Popconfirm
            title={`确定要删除用户 ${user.username}`}
            onConfirm={() => dispatch(deleteOperator(user))}
            okText="确认"
            cancelText="取消"
          >
            <Button type='text' danger>删除</Button>
          </Popconfirm>
        </Space>
      }
    },
  ]
  return (
    <PageHeader
      title='操作员管理'
      onCreate={() => navigate('/operator/create')}
    >
      <ResultTable columns={columns} dataSource={users} rowKey='_id' />
    </PageHeader>
  )

}

const mapStateToProps = state => {
  return {
    users: state.system.users.valueSeq().valueSeq().toArray(),
  }
}

export default connect(mapStateToProps)(Operator)
