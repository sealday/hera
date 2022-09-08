import { Error, Loading, PageHeader, ResultTable } from '../../components'
import { employeeSchema } from '../../schema'
import heraApi from '../../api'
import { useNavigate } from 'react-router-dom'


export default () => {
  const navigate = useNavigate()
  const columns = employeeSchema.map(item => ({ key: item.name, title: item.label, dataIndex: item.name }))
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