import { Button, Card, Table } from 'antd'
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
    .concat([{ key: 'action', title: '操作', render: () => <span>待定</span> }])
  const extra = []
  if (data.type !== '盘点') {
    extra.push(<Button key='transport' onClick={() => navigate(`/transport/${params.id}`)}>运输单</Button>)
  }

  return <PageHeader
    onEdit={onEdit}
    onPrintPreview={onPrintPreview}
    extra={extra}
    title="订单信息"
  >
    <Card bordered={false}>
      <Table columns={columns} dataSource={data.entries} rowKey={item => ({ name: item.name, size: item.size })} />
    </Card>
  </PageHeader>
}

export default Record