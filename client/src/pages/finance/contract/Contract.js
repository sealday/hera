import React, { useEffect } from 'react'
import moment from 'moment'
import { pick } from 'lodash'
import { Button, Table, Space, Tag, Popconfirm } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CONTRACT, newErrorNotify, newSuccessNotify, queryContracts } from '../../../actions'
import { ajax } from '../../../utils'
import { PageHeader, ResultTable } from '../../../components'

const ContractDeleteButton = ({ record }) => {
  const dispatch = useDispatch()
  return <Popconfirm
    title={`确认删除“${record.name}”合同吗？（删除后可通过管理员恢复）`}
    onConfirm={() => {
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
  </Popconfirm>
}

const ContractFinishButton = ({ record }) => {
  const dispatch = useDispatch()
  return <Popconfirm
    title={`确认完结“${record.name}”合同吗？`}
    onConfirm={() => {
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
  </Popconfirm>
}

const ContractUnfinishButton = ({ record }) => {
  const dispatch = useDispatch()
  return <Popconfirm
    title={`确认取消完结“${record.name}”合同吗？`}
    onConfirm={() => {
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
  </Popconfirm>
}

export default () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const contracts = useSelector(state => state.results.get(CONTRACT, []))
  useEffect(() => {
    dispatch(queryContracts())
  }, [dispatch])
  const columns = [
    { title: "名称", key: "name", dataIndex: "name" },
    { title: "编号", key: "code", dataIndex: "code" },
    { title: "日期", key: "date", dataIndex: "date", render(date) { return moment(date).format('YYYY-MM-DD') } },
    { title: "地址", key: "address", dataIndex: "address" },
    { title: "备注", key: "comments", dataIndex: "comments" },
    {
      title: "状态", key: "status", dataIndex: "status", render(tag) {
        const color = tag === '进行' ? 'green' : 'red';
        return <Tag color={color}>{tag}</Tag>
      }
    },
    {
      title: '操作', key: 'action', render(_, record) {
        return (
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
    },
  ]
  return (
    <PageHeader
      title="合同管理"
      onCreate={() => navigate('/contract/create')}
    >
      <ResultTable dataSource={contracts} columns={columns} rowKey="_id" pagination={{

      }} />
    </PageHeader>
  )
}