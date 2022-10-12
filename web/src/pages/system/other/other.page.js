import { Error, Loading, PageHeader, PopoverFormButton, ResultTable, TabTreeTable, TreeTable } from '../../../components'
import { otherSchema } from '../../../schema'
import heraApi from '../../../api'
import { useNavigate } from 'utils/hooks'
import { Button, ConfigProvider, message, Popconfirm, Space } from 'antd'
import { useEffect } from 'react'
import _ from 'lodash'
import { buildTree } from '../../../utils'
import { PlusCircleOutlined } from '@ant-design/icons'
import { genTableColumn } from '../../../utils/antd'


export default () => {
  const [deleteOther, deleteResult] = heraApi.useDeleteOtherMutation()
  const [createOther, createResult] = heraApi.useCreateOtherMutation()
  const [updateOther, updateResult] = heraApi.useUpdateOtherMutation()
  const columns = genTableColumn(otherSchema)
  const onCreate = (v) => {
    createOther({ ...v, parentId: '-1' })
  }
  const onItemCreate = (values, parentId) => {
    createOther({ ...values, parentId })
  }
  const onItemUpdate = (item, values) => {
    updateOther({ id: item._id, other: { ...item, ...values } })
  }
  const onItemDelete = item => {
    if (_.size(item.children) > 0) {
      message.error(`【${item.name}】下面有子节点，请勿删除。`)
    } else {
      deleteOther(item._id)
    }
  }
  columns.push({
    key: 'action',
    title: '操作',
    render(_, item) {
      return (
        <Space>
          <PopoverFormButton onSubmit={v => onItemCreate(v, item.id)} schema={otherSchema}>新增</PopoverFormButton>
          <PopoverFormButton initialValues={item} onSubmit={v => onItemUpdate(item, v)} schema={otherSchema}>编辑</PopoverFormButton>
          <Popconfirm onConfirm={() => onItemDelete(item)} title='确认删除？'>
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
  const others = _.cloneDeep(getOtherListQuery.data).sort((a, b) => {
    const aValue  = _.reduce(a.id.split('.'), (result, v) => result * 1000 + v, 0)
    const bValue  = _.reduce(b.id.split('.'), (result, v) => result * 1000 + v, 0)
    return aValue - bValue
  })
  const dataSource = buildTree(others)
  return (
    <PageHeader
      title='费用信息'
    >
      <ConfigProvider>
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