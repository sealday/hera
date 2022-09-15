import { Button, Card, Table } from 'antd'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetRecordQuery } from '../../api'
import { Error, Loading, PageHeader } from '../../components'
import record from '../../schema/record'
import recordSchema from '../../schema/record'
import { genTableColumn } from '../../utils/antd'

const styles = {
  keepSpace: { marginTop: '8px' }
}
const Record = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { data: record, error, isLoading } = useGetRecordQuery(params.id)
  const projects = useSelector(state => state.system.projects)
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
    .concat([{ key: 'action', title: '操作' }])
  const complementSchema = recordSchema.find(item => item.name === 'complements').schema
  const complementColumns = genTableColumn(complementSchema)
    .concat([{ key: 'action', title: '操作' }])
  const extra = []
  if (record.type !== '盘点') {
    extra.push(<Button key='transport' onClick={() => navigate(`/transport/${params.id}`)}>运输单</Button>)
  }

  const descriptions = []
  if (record.type !== '盘点') {
    descriptions.push({ label: '出库项目/仓库', children: projects.get(record.outStock).name })
    descriptions.push({ label: '入库项目/仓库', children: projects.get(record.inStock).name })
  } else {
    descriptions.push({ label: '仓库盘点', children: projects.get(record.inStock).name })
  }
  descriptions.push({ label: '出库时间', children: moment(record.outDate).format('YYYY-MM-DD') })
  descriptions.push({ label: '制单人', children: record.username })

  return <PageHeader
    onEdit={onEdit}
    onPrintPreview={onPrintPreview}
    extra={extra}
    title="出入库记录"
    subTitle={`${record.type}单 No.${record.number}`}
    descriptions={descriptions}
  >
    <Card bordered={false} title='明细信息'>
      <Table columns={columns} dataSource={record.entries} rowKey='_id' />
    </Card>
    <Card bordered={false} title='补充信息' style={styles.keepSpace}>
      <Table columns={complementColumns} dataSource={record.complements} rowKey='_id' />
    </Card>
  </PageHeader>
}

export default Record