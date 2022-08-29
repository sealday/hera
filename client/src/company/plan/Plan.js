import moment from 'moment'
import _ from 'lodash'
import {
  Button,
  PageHeader,
  Space,
  Table,
  Tag,
  Card,
} from 'antd'
import {
  PlusOutlined,
} from '@ant-design/icons'
import {
  Link,
} from 'react-router-dom'

import { PLAN_CATEGORY_MAP } from '../../constants'
import { useDispatch, useSelector } from 'react-redux'
import { ALL_PLAN_FLAT, queryAllPlansFlat } from '../../actions'
import { useEffect } from 'react'

const Plan = () => {
  const dispatch = useDispatch()
  const plans = useSelector(state => state.results.get(ALL_PLAN_FLAT, []))
  useEffect(() => {
    dispatch(queryAllPlansFlat())
  }, [dispatch])
  return <>
    <PageHeader
      title="合同计算方案"
      ghost={false}
      extra={[
        <Link to="/plan/create"><Button type="primary"><PlusOutlined />新增</Button></Link>
      ]}
    />
    <div style={{ height: '8px' }}></div>
    <Card title="方案列表" bordered={false}>
      <Table dataSource={plans} rowKey="_id">
        <Table.Column title="分类" key="category" dataIndex="category"
          render={category => PLAN_CATEGORY_MAP[category]}
          filters={
            _.map(PLAN_CATEGORY_MAP, (v, k) => ({ text: v, value: k }))
          }
          onFilter={(value, record) => record.category.indexOf(value) === 0}
        />
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
            (text, record) => (
              <Space size="middle">
                <a>编辑</a>
                <a>克隆</a>
                <a>废弃</a>
              </Space>
            )
          }
        />
      </Table>
    </Card>
  </>
}
export default Plan