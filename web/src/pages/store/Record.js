import { Button, Card, Descriptions, Table } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import { useNavigate } from 'utils/hooks'
import { useParams } from 'utils/hooks'
import heraApi, { useGetRecordQuery } from '../../api'
import { Error, Loading, PageHeader } from '../../components'
import recordSchema from '../../schema/record'
import { toFixedWithoutTrailingZero as fixed } from '../../utils'
import { genTableColumn } from '../../utils/antd'

const styles = {
  keepSpace: { marginTop: '8px' }
}

const Summary = ({ entries }) => {
  if (_.isUndefined(entries) || entries.length === 0) {
    return ''
  }
  // reduce
  const resultEntries = _.reduce(entries, (result, item) => {
    if (_.isUndefined(result[`${item.type}|${item.name}`])) {
      result[`${item.type}|${item.name}`] = {
        count: 0,
        unit: item.unit,
      }
    }
    result[`${item.type}|${item.name}`].count += item.subtotal
    result['理论重量'].count += item.weight
    return result
  }, { 理论重量: { count: 0, unit: '吨' } })
  const items = _.map(resultEntries, (v, k)=> (
    <Descriptions.Item key={k} label={k}>{fixed(v.count)}{v.unit}</Descriptions.Item>
  ))
  return (
    <Descriptions title='小结'>
      {items}
    </Descriptions>
  )
}

const Record = ({ isFinance = false }) => {
  const params = useParams()
  const navigate = useNavigate()
  const { data: record, error, isLoading } = useGetRecordQuery(params.id)

  const getProjectListAll = heraApi.useGetProjectListAllQuery()
  if (error || getProjectListAll.error) {
    return <Error />
  }
  if (isLoading || getProjectListAll.isLoading) {
    return <Loading />
  }
  const projects = getProjectListAll.data
  const onEdit = () => {
    navigate(`/record/${params.id}/edit`)
  }
  const onPrintPreview = () => {
    navigate(`/record/${params.id}/preview`)
  }
  const entriesSchema = recordSchema.find(item => item.name === 'entries')
  const columns = genTableColumn(entriesSchema.form)
  const complementSchema = recordSchema.find(item => item.name === 'complements').schema
  const complementColumns = genTableColumn(complementSchema)
    .concat([{ key: 'action', title: '操作' }])
  const extra = []
  if (record.type !== '盘点') {
    extra.push(<Button key='transport' onClick={() => navigate(`/transport/${params.id}`)}>运输单</Button>)
  }

  const descriptions = []
  if (record.type !== '盘点') {
    descriptions.push({ label: '出库项目/仓库', children: record.outStock.name })
    descriptions.push({ label: '入库项目/仓库', children: record.inStock.name })
  } else {
    descriptions.push({ label: '仓库盘点', children: record.inStock.name })
  }
  descriptions.push({ label: '出库时间', children: moment(record.outDate).format('YYYY-MM-DD') })
  descriptions.push({ label: '制单人', children: record.username })
  descriptions.push({ label: '原始单号', children: record.originalOrder })
  descriptions.push({ label: '车号', children: record.carNumber })
  descriptions.push({ label: '实际重量', children: record.weight ? record.weight + '吨' : '' })
  descriptions.push({ label: '合同运费', children: record.freight ? '计入合同' : '不计入合同' })
  descriptions.push({ label: '备注', children: record.comments })

  return <PageHeader
    onEdit={!isFinance ? onEdit : false}
    onPrintPreview={onPrintPreview}
    extra={!isFinance ? extra : false}
    title="出入库记录"
    subTitle={`${record.type}单 No.${record.number}`}
    descriptions={descriptions}
  >
    <Card bordered={false} title='明细信息'>
      <Table columns={columns} dataSource={record.entries} footer={() => <Summary entries={record.entries} />} rowKey='_id' />
    </Card>
    <Card bordered={false} title='补充信息' style={styles.keepSpace}>
      <Table columns={complementColumns} dataSource={record.complements} rowKey='_id' />
    </Card>
  </PageHeader>
}

export default Record