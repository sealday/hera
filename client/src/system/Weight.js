import React, { useEffect } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {
  Button,
  Popconfirm,
  Space,
  Table,
} from 'antd'

import { ajax } from '../utils'
import { newErrorNotify, newInfoNotify, newSuccessNotify, queryWeightPlan, WEIGHT_PLAN } from '../actions'
import { PageHeader } from '../components'

const Weight = ({ dispatch, plans }) => {
  const navigate = useNavigate()
  const load = () => {
    dispatch(queryWeightPlan())
  }
  useEffect(() => {
    load()
  }, [])
  const handleDelete = (id) => {
    dispatch(newInfoNotify('提示', '正在删除', 1000))
    ajax(`/api/plan/weight/${ id }/delete`, {
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      dispatch(newSuccessNotify('提示', '删除成功', 1000))
      load()
    }).catch((err) => {
      dispatch(newErrorNotify('警告', '删除失败', 1000))
    })
  }
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: "日期",
      dataIndex: "date",
      key: "date",
      render: date => moment(date).format('YYYY-MM-DD'),
      sorter: (a, b) => moment(a.date) - moment(b.date),
      width: "150px",
    },
    {
      title: '备注',
      dataIndex: 'comments',
      key: 'comments',
    },
    {
      title: '动作',
      dataIndex: 'action',
      key: 'action',
      render: (_, plan) => {
        return <Space>
          <Link to={`/weight/${plan._id}`}>编辑</Link>
          <Popconfirm
            title={`确认删除“${plan.name}”方案吗？`}
            onConfirm={() => handleDelete(plan._id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type='text' danger>删除</Button>
          </Popconfirm>
          <Link to={`/weight/create/${plan._id}`}>克隆</Link>
        </Space>
      }
    },
  ]
    return (
      <div>
        <PageHeader 
          title='计重方案'
          subTitle='在计重方案里面设计项目独有的理论重量'
          onCreate={() => navigate('/weight/create')}
        />
        <Table dataSource={plans} columns={columns} rowKey='_id'  />
      </div>
    )
}

const mapStateToProps = (state) => {
  const plans = state.results.get(WEIGHT_PLAN, [])
  return {
    plans: plans,
  }
}
export default connect(mapStateToProps)(Weight)
