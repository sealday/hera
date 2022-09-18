import { Error, Loading, PageHeader, PopoverFormButton, ResultTable, TabTreeTable, TreeTable } from '../../../components'
import { otherSchema } from '../../../schema'
import heraApi from '../../../api'
import { useNavigate } from 'react-router-dom'
import { Button, ConfigProvider, message, Popconfirm, Space } from 'antd'
import { useEffect } from 'react'
import _ from 'lodash'
import { buildTree } from '../../../utils'
import { PlusCircleOutlined } from '@ant-design/icons'


export default () => {
  const [deleteOther, deleteResult] = heraApi.useDeleteOtherMutation()
  const [createOther, createResult] = heraApi.useCreateOtherMutation()
  const [updateOther, updateResult] = heraApi.useUpdateOtherMutation()
  const columns = otherSchema.map(item => ({ key: item.name, title: item.label, dataIndex: item.name }))
  const onCreate = (v) => {
    createOther({ ...v, parentId: '-1' })
  }
  const onItemCreate = (values, parentId) => {
    createOther({ ...values, parentId })
  }
  const onItemUpdate = (item, values) => {
    updateOther({ id: item._id, other: { ...item, ...values } })
  }
  columns.push({
    key: 'action',
    title: '操作',
    render(_, item) {
      return (
        <Space>
          <PopoverFormButton onSubmit={v => onItemCreate(v, item.id)} schema={otherSchema}>新增</PopoverFormButton>
          <PopoverFormButton initialValues={item} onSubmit={v => onItemUpdate(item, v)} schema={otherSchema}>编辑</PopoverFormButton>
          <Popconfirm onConfirm={() => deleteOther(item._id)} title='确认删除？'>
            <Button type='text' danger >删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  })
  const getOtherListQuery = heraApi.useGetOtherListQuery()
  if (getOtherListQuery.isError) {
    return <Error />
  }
  if (getOtherListQuery.isLoading) {
    return <Loading />
  }
  // 排序
  const others = _.cloneDeep(getOtherListQuery.data).sort((a, b) => Number(a.id) - Number(b.id))
  const dataSource = buildTree(others)
  return (
    <PageHeader
      title='费用信息'
    >
      <ConfigProvider componentSize='small'>
        <TreeTable
          actions={
            <PopoverFormButton
              icon={<PlusCircleOutlined />}
              type='primary' block key='create' onSubmit={v => onCreate(v)}
              schema={otherSchema}>
              新增
            </PopoverFormButton>
          }
          rowKey='_id'
          expandRowByClick={false}
          columns={columns}
          dataSource={dataSource}
        />
      </ConfigProvider>
    </PageHeader>
  )
}