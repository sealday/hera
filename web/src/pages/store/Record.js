import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Card, Col, Descriptions, Dropdown, Row, Space, Table, Tabs, Tag } from 'antd'
import { confirm } from 'components/utils'
import _ from 'lodash'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useNavigate } from 'utils/hooks'
import { useParams } from 'utils/hooks'
import heraApi, { useGetRecordQuery } from '../../api'
import { Error, LinkButton, Loading, PageHeader } from '../../components'
import recordSchema from '../../schema/record'
import { toFixedWithoutTrailingZero as fixed } from '../../utils'
import { genTableColumn } from '../../utils/antd'
import { createRecord } from './RecordCreate'


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

const entriesSchema = recordSchema.find(item => item.name === 'entries')
const columns = genTableColumn(entriesSchema.form)
const complementSchema = recordSchema.find(item => item.name === 'complements').schema
const complementColumns = genTableColumn(complementSchema)
const additionalSchema = recordSchema.find(item => item.name === 'additionals').schema
const additionalColumns = genTableColumn(additionalSchema)

const Record = ({ isFinance = false }) => {
  const params = useParams()
  const navigate = useNavigate()
  const { data: record, error, isLoading, refetch } = useGetRecordQuery(params.id)
  const project = useProject(record)
  const store = useSelector(state => state.system.store)
  const [updateReceipt] = heraApi.useUpdateRecordReceiptMutation()
  const [updateCounterfoil] = heraApi.useUpdateRecordCounterfoilMutation()

  if (error) {
    return <Error />
  }
  if (isLoading) {
    return <Loading />
  }
  const onEdit = [
    { key: 'onEdit', label: '编辑', onClick: () => { navigate(`/record/${params.id}/edit`) } },
    {
      key: 'receipt', label: '签收回单联', onClick: () => {
        confirm({
          title: '确认签收回单联？', content: '请注意，确认签收后不可撤销。', icon: <ExclamationCircleOutlined />, onOk: () => {
            updateReceipt(record._id)
          }
        })
      }
    },
    {
      key: 'counterfoil', label: '签收存根联', onClick: () => {
        confirm({
          title: '确认签收回单联？', content: '请注意，确认签收后不可撤销。', icon: <ExclamationCircleOutlined />, onOk: () => {
            updateCounterfoil(record._id)
          }
        })
      }
    },
  ]   
  const onPrintPreview = () => {
    navigate(`/record/${params.id}/preview`)
  }
  const extra = []
  if (record.type !== '盘点') {
    extra.push(<Button key='transport' onClick={() => navigate(`/transport/${params.id}`)}>运输单</Button>)
  }
  if (record.type === '调拨') {
    extra.push(<Dropdown key='purchase' menu={{
      items: [
        { label: '采购入库', key: '采购入库', onClick: () => createRecord({ record, project, refetch, direction: 'in' }) },
        { label: '销售出库', key: '销售出库', onClick: () => createRecord({ record, project, refetch, direction: 'out' }) },
      ]
    }}>
      <Button>关联购销单</Button>
    </Dropdown>)
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
  descriptions.push({ label: '回单联', children: record.receipt ? <Tag color='green'>已签收</Tag> : <Tag color='red'>未签收</Tag> })
  descriptions.push({ label: '存根联', children: record.counterfoil ? <Tag color='green'>已签收</Tag> : <Tag color='red'>未签收</Tag> })
  descriptions.push({ label: '备注', children: record.comments })

  return <PageHeader
    onEdit={!isFinance ? onEdit : false}
    onPrintPreview={onPrintPreview}
    extra={!isFinance ? extra : false}
    title="出入库记录"
    subTitle={`${record.type}单 No.${record.number}`}
    descriptions={descriptions}
  >
    <Card>
    <Tabs 
    items={[
        {
          label: '明细', key: '明细', children:
              <Table columns={columns} dataSource={record.entries} footer={() => <Summary entries={record.entries} />} rowKey='_id' />
        },
        ..._.map(record.associatedRecords, (record) => {
          const direction = getDirection(record, store)
          const title = direction === 'in' ? '采购入库 No.' + record.number : '销售出库 No.' + record.number
          return { label: title, key: title, children: <DetailCard record={record} /> }
        }),
        {
          label: '维修赔偿', key: '维修赔偿', children:
            <Table columns={complementColumns} dataSource={record.complements} rowKey='_id' />
        },
        {
          label: '额外内容', key: '额外内容', children:
              <Table columns={additionalColumns} dataSource={record.additionals} rowKey='_id' />
        }
    ]}
    />
    </Card>
  </PageHeader>
}

const DetailCard = ({ record }) => {
  return <Row gutter={[16, 16]}>
    <Col flex='auto' ></Col>
    <Col>
      <Space>
        <LinkButton key='query' type='default' to={`/record/${record._id}`}>查询</LinkButton>
        <LinkButton key='edit' type='primary' to={`/record/${record._id}/edit`}>编辑</LinkButton>
      </Space>
    </Col>
    <Col span={24}>
      <Table columns={columns} dataSource={record.entries} footer={() => <Summary entries={record.entries} />} rowKey='_id' />
    </Col>
  </Row>
}

export const getDirection = (record, store) => {
  return _.get(record, 'inStock._id') === _.get(store, '_id') ? 'in' : _.get(record, 'outStock._id') === _.get(store, '_id') ? 'out' : ''
}

export const useDirection = (record) => {
  const store = useSelector(state => state.system.store)
  if (!record) {
    return ''
  }
  return getDirection(record, store)
}

export const useProject = (record) => {
  const store = useSelector(state => state.system.store)
  if (!record) {
    return null
  }
  if (record.inStock._id === store._id) {
    return record.outStock
  }
  if (record.outStock._id === store._id) {
    return record.inStock
  }
  return null
}

export default Record