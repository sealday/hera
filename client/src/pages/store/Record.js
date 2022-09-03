import { Button, Table } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetRecordQuery } from '../../api'
import { Error, Loading, PageHeader } from '../../components'
import recordSchema from '../../schema/record'

const Record = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { data, error, isLoading } = useGetRecordQuery(params.id)
  if (error) {
    return <Error />
  }
  if (isLoading) {
    return <Loading />
  }
  const onEdit = () => {
    navigate(`/record/${params.id}/edit`)
  }
  const onPrintPreview = () => {
    navigate(`/record/${params.id}/preview`)
  }
  const entriesSchema = recordSchema.find(item => item.name === 'entries')
  const columns = entriesSchema.form
    .filter(item => item.type !== 'formula')
    .map(item => ({ key: item.name, title: item.label, dataIndex: item.name }))
    .concat([{key: 'action', title: '操作', render: () => <span>待定</span>}])
  
  return <PageHeader
    onEdit={onEdit}
    onPrintPreview={onPrintPreview}
    extra={[<Button onClick={() => navigate(`/transport/${params.id}`)}>运输单</Button>]}
    title="订单信息"
  >
    <Table columns={columns} dataSource={data.entries} rowKey={item => ({ name: item.name, size: item.size })} />
  </PageHeader>
}

export default Record