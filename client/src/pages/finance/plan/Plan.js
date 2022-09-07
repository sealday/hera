import moment from 'moment'
import _ from 'lodash'
import {
  Space,
  Table,
  Tag,
  Card,
  Tabs,
  Button,
} from 'antd'
import {
  useNavigate,
} from 'react-router-dom'

import { PLAN_CATEGORY_MAP } from '../../../constants'
import { useDispatch, useSelector } from 'react-redux'
import { ALL_PLAN_FLAT, queryAllPlansFlat } from '../../../actions'
import { useEffect } from 'react'
import { PageHeader } from '../../../components'

const Plan = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const plans = useSelector(state => state.results.get(ALL_PLAN_FLAT, []))
  useEffect(() => {
    dispatch(queryAllPlansFlat())
  }, [dispatch])
  const tabs = _.map(PLAN_CATEGORY_MAP, (v, k) => ({ key: k, label: v, children: null }))
  // 设置 tab 内容
  tabs.forEach(tab => {
    tab.children = (
      <Table dataSource={_.filter(plans, plan => plan.type === tab.key)} rowKey="_id">
        <Table.Column title="名称" key="name" dataIndex="name" />
        <Table.Column title="关联项目" key="project" dataIndex="project" />
        <Table.Column title="日期" key="date" dataIndex="date"
          render={date => moment(date).format('YYYY-MM-DD')}
        />
        <Table.Column title="备注" key="comments" dataIndex="comments" />
        <Table.Column title="状态" key="status" dataIndex="status"
          defaultFilteredValue={['在用']}
          filters={
            [
              { text: '在用', value: '在用' },
              { text: '弃用', value: '弃用' },
            ]
          }
          onFilter={
            (value, record) => record.status.indexOf(value) === 0
          }
          render={
            tag => {
              const color = tag === '在用' ? 'green' : 'red';
              return <Tag color={color}>{tag}</Tag>
            }
          }
        />
        <Table.Column title="" key="action"
          render={
            (_text, record) => (
              <Space size="small">
                <Button type='text' onClick={() => navigate(`/plan/${record._id}/edit`)}>编辑</Button>
                <Button type='text'>克隆</Button>
                <Button type='text'>废弃</Button>
              </Space>
            )
          }
        />
      </Table>
    )
  })
  return (
    <PageHeader
      title="计算方案"
      onCreate={() => navigate('/plan/create')}
    >
      <Card bordered={false}>
        <Tabs items={tabs} />
      </Card>
    </PageHeader>
  )
}
export default Plan