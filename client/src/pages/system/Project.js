import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  Button,
  Popconfirm,
  Space,
} from 'antd'
import {
  PageHeader, ResultTable,
} from '../../components'

import {
  updateProject,
  removeProject,
} from '../../actions'
import {
  wrapper,
  DEFAULT_TAB_INDEX,
  ajax,
} from '../../utils'

const btnStatusName = project => {
  if (project.status === 'FINISHED') {
    return '启用'
  } else {
    return '禁用'
  }
}

const Project = ({ projects, onDeleteClick, onStatusChange }) => {

  const [tab, setTab] = useState(DEFAULT_TAB_INDEX)
  const navigate = useNavigate()

  const columns = [
    { title: '类型', dataIndex: 'type', key: 'type', width: '100px', },
    { title: '公司名称', dataIndex: 'company', key: 'company', ellipsis: true },
    { title: '公司电话', dataIndex: 'companyTel', key: 'companyTel' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '电话', dataIndex: 'tel', key: 'tel', },
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true, },
    { title: '备注', dataIndex: 'comments', key: 'comments', ellipsis: true, },
    {
      title: '操作', key: 'action', width: '200px',
      render: (_, project) => {
        return <Space size='small'>
          <Link to={`/project/${project._id}/edit`}><Button type='text'>编辑</Button></Link>
          <Popconfirm
            title={`确定要删除？`}
            onConfirm={() => onDeleteClick(project)}
          >
            <Button type='text' danger>删除</Button>
          </Popconfirm>
          <Popconfirm
            title={`确定要暂时${btnStatusName(project)}？`}
            onConfirm={() => onStatusChange(project)}
          >
            <Button type="text">{btnStatusName(project)}</Button>
          </Popconfirm>
        </Space>
      }
    },
  ]

  return (
    <PageHeader
      title='客户管理'
      searchInfo={true}
      onCreate={() => { navigate('/project/create') }}
    >
      <ResultTable columns={columns} rowKey='_id' dataSource={projects.valueSeq().toArray()} />
    </PageHeader>
  )
}

const mapStateToProps = state => {
  return {
    projects: state.system.rawProjects,
  }
}

const mapDispatchToProps = dispatch => ({
  onDeleteClick(project) {
    ajax(`/api/project/${project._id}/delete`, { method: 'POST' })
      .then(res => dispatch(removeProject(res.data.project._id)))
  },
  onStatusChange(project) {
    ajax(`/api/project/${project._id}/status`, {
      method: 'POST',
      data: JSON.stringify({ status: project.status === 'FINISHED' ? 'UNDERWAY' : 'FINISHED' }),
    })
      .then(res => {
        dispatch(updateProject(res.data.project))
      })
  }
})

export default wrapper([
  connect(mapStateToProps, mapDispatchToProps),
  Project,
])
