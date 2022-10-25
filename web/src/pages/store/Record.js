import { Button, Card, Descriptions, Table } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import { useSelector } from 'react-redux'
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
  const result = heraApi.useGetProductListQuery()
  if (_.isUndefined(entries)) {
    return ''
  }
  // 排除空值
  const validEntries = entries
  if (result.isError || result.isLoading || validEntries.length === 0) {
    return ''
  }
  // 关联数据
  const equippedEntries = validEntries.map(entry => ({
    ...result.data.find(item =>
      item.type === entry.type &&
      item.name === entry.name &&
      item.size === entry.size
    ),
    ...entry
  })).filter(item => !_.isUndefined(item.weight))
  // 计算结果
  const calculatedEntries = equippedEntries.map(item => ({
    ...item,
    total: item.isScaled ? item.count * item.scale : item.count,
    weight: item.count * item.weight / 1000,
  }))
  // reduce
  const resultEntries = _.reduce(calculatedEntries, (result, item) => {
    if (_.isUndefined(result[`${item.type}|${item.name}`])) {
      result[`${item.type}|${item.name}`] = {
        count: 0,
        unit: item.isScaled ? item.unit : item.countUnit,
      }
    }
    result[`${item.type}|${item.name}`].count += item.total
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
    descriptions.push({ label: '出库项目/仓库', children: _.get(projects.find(p => p._id === record.outStock), 'name') })
    descriptions.push({ label: '入库项目/仓库', children: _.get(projects.find(p => p._id === record.inStock), 'name') })
  } else {
    descriptions.push({ label: '仓库盘点', children: _.get(projects.find(p => p._id === record.inStock), 'name') })
  }
  descriptions.push({ label: '出库时间', children: moment(record.outDate).format('YYYY-MM-DD') })
  descriptions.push({ label: '制单人', children: record.username })
  descriptions.push({ label: '原始单号', children: record.originalOrder })
  descriptions.push({ label: '车号', children: record.carNumber })
  descriptions.push({ label: '实际重量', children: record.weight ? record.weight + '吨' : '' })
  descriptions.push({ label: '合同运费', children: record.freight ? '计入合同' : '不计入合同' })
  descriptions.push({ label: '备注', children: record.comments })

  return <PageHeader
    onEdit={isFinance ? onEdit : false}
    onPrintPreview={onPrintPreview}
    extra={isFinance ? extra : false}
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