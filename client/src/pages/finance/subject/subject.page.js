import { Error, Loading, PageHeader, PopoverFormButton, ResultTable, TabTreeTable, TreeTable } from '../../../components'
import { subjectSchema } from '../../../schema'
import heraApi from '../../../api'
import { useNavigate } from 'react-router-dom'
import { Button, message, Popconfirm, Space } from 'antd'
import { useEffect } from 'react'
import _ from 'lodash'


export default () => {
  const navigate = useNavigate()
  const [deleteSubject, deleteResult] = heraApi.useDeleteSubjectMutation()
  const [createSubject, createResult] = heraApi.useCreateSubjectMutation()
  const [updateSubject, updateResult] = heraApi.useUpdateSubjectMutation()
  const columns = subjectSchema.map(item => ({ key: item.name, title: item.label, dataIndex: item.name }))
  useEffect(() => {
    if (deleteResult.isError) {
      message.success('删除失败~')
    }
  }, [deleteResult.isError])
  useEffect(() => {
    if (createResult.isError) {
      message.success('创建失败~')
    }
  }, [createResult.isError])
  useEffect(() => {
    if (updateResult.isError) {
      message.success('更新失败~')
    }
  }, [updateResult.isError])
  const onTabCreate = (v, tab) => {
    createSubject({ ...v, type: tab, parentId: '-1' })
  }
  const onItemCreate = (values, type, parentId) => {
    createSubject({ ...values, type, parentId })
  }
  const onItemUpdate = (item, values) => {
    updateSubject({ id: item._id, subject: { ...item, ...values }})
  }
  columns.push({
    key: 'action',
    title: '操作',
    render(_, item) {
      return (
        <Space size='small'>
          <PopoverFormButton size='small' onSubmit={v => onItemCreate(v, item.type, item.id)} schema={subjectSchema.filter(item => item.name !== 'type')}>新增</PopoverFormButton>
          <PopoverFormButton size='small' initialValues={item} onSubmit={v => onItemUpdate(item, v)} schema={subjectSchema.filter(item => item.name !== 'type')}>编辑</PopoverFormButton>
          <Popconfirm onConfirm={() => deleteSubject(item._id)} title='确认删除？'>
            <Button size='small' type='text' danger >删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  })
  const getSubjectListQuery = heraApi.useGetSubjectListQuery()
  if (getSubjectListQuery.isError) {
    return <Error />
  }
  if (getSubjectListQuery.isLoading) {
    return <Loading />
  }
  const subjects = _.cloneDeep(getSubjectListQuery.data)
  const dataSource = []
  _.forEach(subjects, subject => {
    if (subject.parentId === '-1') {
      dataSource.push(subject)
    } else {
      const parent = subjects.find(item => item.id === subject.parentId)
      if (!parent) {
        // 找不到父亲直接下一个
        return
      }
      if (parent.children) {
        parent.children.push(subject)
      } else {
        parent.children = [subject]
      }
    }
  })

  return (
    <PageHeader
      title='科目设定'
      onCreate={() => { navigate('/subject/create') }}
    >
      <TabTreeTable 
        footers={tab => [
          <PopoverFormButton
            type='primary' block key='create' onSubmit={v => onTabCreate(v, tab)}
            schema={subjectSchema.filter(item => item.name !== 'type')}>
            新增
          </PopoverFormButton>
        ]}
        expandRowByClick={false}
        columns={columns}
        rowKey='id'
        dataSource={dataSource}
        tabDef={{ dataIndex: 'type', values: ['资产', '负债', '成本', '损益'] }}
      />
    </PageHeader>
  )
}