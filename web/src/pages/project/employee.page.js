import { Error, Loading, PageHeader, ResultTable } from '../../components'
import { employeeSchema } from '../../schema'
import heraApi from '../../api'
import { useNavigate } from 'utils/hooks'
import { Button, Popconfirm, Space } from 'antd'


export default () => {
  const navigate = useNavigate()
  const [deleteEmployee] = heraApi.useDeleteEmployeeMutation()
  const columns = employeeSchema.map(item => ({ key: item.name, title: item.label, dataIndex: item.name }))
  columns.push({
    key: 'action',
    title: '操作',
    render(_, item) {
      return (
        <Space size='small'>
          <Button type='text' onClick={() => navigate(`/employee/${item._id}/edit`)}>编辑</Button>
          <Popconfirm onConfirm={() => deleteEmployee(item._id)} title='确认删除？'>
            <Button type='text' danger >删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  })
  const getEmployeeListQuery = heraApi.useGetEmployeeListQuery()
  if (getEmployeeListQuery.isError) {
    return <Error />
  }
  if (getEmployeeListQuery.isLoading) {
    return <Loading />
  }
  return (
    <PageHeader
      title='员工档案'
      onCreate={() => { navigate('/employee/create') }}
    >
      <ResultTable columns={columns} rowKey='employeeID' dataSource={getEmployeeListQuery.data} />
    </PageHeader>
  )
}