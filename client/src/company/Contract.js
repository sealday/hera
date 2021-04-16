import React, { useEffect } from 'react'

import moment from 'moment'
import { Button, PageHeader, Table, Space, Tag, Popconfirm } from 'antd'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { CONTRACT, newErrorNotify, newInfoNotify, newSuccessNotify, queryContracts } from '../actions'
import { ajax } from '../utils'
import { pick } from 'lodash'


const ContractDeleteButton = connect()(({ record, dispatch }) => <Popconfirm
  title={`确认删除“${record.name}”合同吗？（删除后可通过管理员恢复）`}
  onConfirm={() => {
    dispatch(newInfoNotify('提示', '正在删除', 1000))
    ajax(`/api/contract/${record._id}/delete`, {
      method: 'POST',
      contentType: 'application/json'
    }).then(() => {
      dispatch(newSuccessNotify('提示', '删除成功', 1000))
      dispatch(queryContracts())
    }).catch(() => {
      dispatch(newErrorNotify('警告', '删除失败', 1000))
    })
  }}
  okText="确认"
  cancelText="取消"
>
  <a style={{ color: 'red' }}>删除</a>
</Popconfirm>)

const ContractFinishButton = connect()(({ record, dispatch }) => <Popconfirm
  title={`确认完结“${record.name}”合同吗？`}
  onConfirm={() => {
    dispatch(newInfoNotify('提示', '正在完结', 1000))
    ajax(`/api/contract/${record._id}/finish`, {
      method: 'POST',
      contentType: 'application/json'
    }).then(() => {
      dispatch(newSuccessNotify('提示', '完结成功', 1000))
      dispatch(queryContracts())
    }).catch(() => {
      dispatch(newErrorNotify('警告', '完结失败', 1000))
    })
  }}
  okText="确认"
  cancelText="取消"
>
  <a>完结</a>
</Popconfirm>)

const ContractUnfinishButton = connect()(({ record, dispatch }) => <Popconfirm
  title={`确认取消完结“${record.name}”合同吗？`}
  onConfirm={() => {
    dispatch(newInfoNotify('提示', '正在取消完结', 1000))
    ajax(`/api/contract/${record._id}/unfinish`, {
      method: 'POST',
      contentType: 'application/json'
    }).then(() => {
      dispatch(newSuccessNotify('提示', '取消完结成功', 1000))
      dispatch(queryContracts())
    }).catch(() => {
      dispatch(newErrorNotify('警告', '取消完结失败', 1000))
    })
  }}
  okText="确认"
  cancelText="取消"
>
  <a>取消完结</a>
</Popconfirm>)

const mapStateToProps = (state) => {
  const contracts = state.results.get(CONTRACT, [])
  return {
    contracts: contracts,
  }
}

export default connect(mapStateToProps)(({ contracts, dispatch }) => {

  useEffect(() => {
    dispatch(queryContracts())
  }, [])

  return <div style={
    {
      background: '#fff',
      padding: '0 8px'
    }
  }>
    <PageHeader
      title="合同列表"
      extra={[
        <Link to="/contract/create"><Button type="primary">新增</Button></Link>
      ]}
    />
    <Table dataSource={contracts} rowKey="_id">
      <Table.Column title="名称" key="name" dataIndex="name" />
      <Table.Column title="编号" key="code" dataIndex="code" />
      <Table.Column title="日期" key="date" dataIndex="date"
        render={date => moment(date).format('YYYY-MM-DD')}
      />
      <Table.Column title="地址" key="address" dataIndex="address" />
      <Table.Column title="备注" key="comments" dataIndex="comments" />
      <Table.Column title="状态" key="status" dataIndex="status"
        render={
          tag => {
            const color = tag === '进行' ? 'green' : 'red';
            return <Tag color={color}>{tag}</Tag>
          }
        }
      />
      <Table.Column title="" key="action"
        render={
          (text, record) => (
            <Space size="middle">
              <Link to={`/contract/${record._id}`}>查看</Link>
              <a onClick={() => {
                const v = pick(record, [
                  'name', 'code', 'project', 'address', 'date', 'comments',
                ])
                v.name += '（克隆）'
                ajax('/api/contract', {
                  data: JSON.stringify(v),
                  method: 'POST',
                  contentType: 'application/json'
                }).then(() => {
                  dispatch(newSuccessNotify('提示', '克隆成功', 1000))
                  dispatch(queryContracts())
                }).catch(() => {
                  dispatch(newErrorNotify('警告', '克隆失败', 1000))
                })
              }}>克隆</a>
              {record.status === '完结' ? <ContractUnfinishButton record={record} /> : <ContractFinishButton record={record} />}
              <ContractDeleteButton record={record} />
            </Space>
          )
        }
      />
    </Table>
  </div>
})