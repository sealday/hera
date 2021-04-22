import _ from 'lodash'
import moment from 'moment'
import {
  Button,
  PageHeader,
  Space,
  Table,
  Tag,
  Card,
  Form,
  Input,
  Select,
  Row,
  Col,
} from 'antd'
import {
  SaveOutlined,
} from '@ant-design/icons'
import {
  Link,
} from 'react-router'

import { PLAN_CATEGORY_MAP } from '../../constants'
import { BackButton, LinkButton } from '../../components'

const PlanCreate = ({ router }) => {
  const [form] = Form.useForm()
  const plans = [
    {
      _id: 1,
      category: 'weight',
      name: '中建八局租金方案',
      date: moment(),
      comments: '',
      status: '在用',
    },
    {
      _id: 1,
      category: 'weight',
      name: '中建八局租金方案',
      date: moment(),
      comments: '',
      status: '弃用',
    }
  ]
  console.log('===')
  return <>
    <PageHeader
      title="新增合同计算方案"
      ghost={false}
      extra={[
        <BackButton key={1} />,
        <Link key={2} to="/plan/create"><Button type="primary"><SaveOutlined />保存</Button></Link>
      ]}
    />
    <Form form={form}>
      <div style={{ height: '8px' }}></div>
      <Card title="基础信息" bordered={false}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="category" label="类型">
              <Select>
                {_.map(PLAN_CATEGORY_MAP, (v, k) => <Select.Option key={k} value={k}>{v}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="name" label="名称">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="date" label="日期">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="comments" label="备注">
          <Input.TextArea />
        </Form.Item>
      </Card>
      <Form.Item noStyle dependencies={['category']}>
        {() => form.getFieldValue('category') === 'price' && <>
          <div style={{ height: '8px' }}></div>
          <Card title="补充信息" bordered={false}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="no" label="运费（元/吨）">
                  <Select>
                    {_.map(PLAN_CATEGORY_MAP, (v, k) => <Select.Option key={k} value={k}>{v}</Select.Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="name" label="运费类型">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="date" label="计重方案">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </>}
      </Form.Item>
    </Form>
    <div style={{ height: '8px' }}></div>
    <Card title="方案明细" bordered={false}>
      <Table dataSource={plans} rowKey="_id">
        <Table.Column title="分类" key="category" dataIndex="category"
          render={category => PLAN_CATEGORY_MAP[category]}
        />
        <Table.Column title="名称" key="name" dataIndex="name" />
        <Table.Column title="日期" key="date" dataIndex="date"
          render={date => moment(date).format('YYYY-MM-DD')}
        />
        <Table.Column title="备注" key="comments" dataIndex="comments" />
        <Table.Column title="状态" key="status" dataIndex="status"
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
                <a>查看</a>
                <a>废弃</a>
                <a>编辑</a>
                <a>克隆</a>
              </Space>
            )
          }
        />
      </Table>
    </Card>
  </>
}
export default PlanCreate