import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Button,
  Popconfirm,
  Space,
  Tag,
} from 'antd'
import {
  Error,
  Loading,
  PageHeader, ResultTable,
} from '../../components'

import heraApi from '../../api'

const btnStatusName = project => {
  if (project.status === 'FINISHED') {
    return '启用'
  } else {
    return '禁用'
  }
}

export default () => {

  const navigate = useNavigate()
  const getProjectList = heraApi.useGetProjectListQuery()
  const [deleteProject] = heraApi.useDeleteProjectMutation()
  const [changeProjectStatus] = heraApi.useChangeProjectStatusMutation()
  if (getProjectList.isError) {
    return <Error />
  }
  if (getProjectList.isLoading) {
    return <Loading />
  }
  const columns = [
    {
      title: '状态', dataIndex: 'status', key: 'status', width: '100px', 
      render: status => status === 'UNDERWAY' ? <Tag color='green'>进行中</Tag> : <Tag color='gray'>已完结</Tag>,
      filters: [{ text: '已完结', value: 'FINISHED' }, {text: '进行中', value: 'UNDERWAY'}],
      onFilter: (value, record) => record.status === value,
    },
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
            onConfirm={() => deleteProject(project._id)}
          >
            <Button type='text' danger>删除</Button>
          </Popconfirm>
          <Popconfirm
            title={`确定要暂时${btnStatusName(project)}？`}
            onConfirm={() => {
              changeProjectStatus({
                id: project._id,
                patch: { status: project.status === 'FINISHED' ? 'UNDERWAY' : 'FINISHED' },
              })
            }}
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
      <ResultTable columns={columns} rowKey='_id' dataSource={getProjectList.data} pagination={{ pageSize: 30 }} />
    </PageHeader>
  )
}