import React, { useEffect } from 'react'

import moment from 'moment'
import { Button, Card, PageHeader, Table, Space, Tag, Row, Col, Popconfirm } from 'antd'
import { Link } from 'react-router'
import 'antd/lib/card/style/css'
import 'antd/lib/page-header/style/css'
import 'antd/lib/table/style/css'
import 'antd/lib/space/style/css'
import 'antd/lib/tag/style/css'
import 'antd/lib/row/style/css'
import 'antd/lib/col/style/css'
import { connect } from 'react-redux'
import { CONTRACT, newErrorNotify, newInfoNotify, newSuccessNotify, queryContracts } from '../actions'
import { ajax } from '../utils'


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

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    render: date => moment(date).format('YYYY-MM-DD'),
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '备注',
    key: 'comments',
    dataIndex: 'comments',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: tag => {
      const color = tag === '进行' ? 'green' : 'red';
      return <Tag color={color}>{tag}</Tag>
    }
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Link to={`/contract/${record._id}`}>查看</Link> 
        <a>克隆</a>
        {record.status === '完结' ? <ContractUnfinishButton record={record}/> : <ContractFinishButton record={record}/>} 
        <ContractDeleteButton record={record}/>
      </Space>
    ),
  },
];

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
    <Table columns={columns} dataSource={contracts} rowKey="_id" />
  </div>
})