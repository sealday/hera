import _ from 'lodash'
import {
  Button,
  PageHeader,
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

import { PLAN_CATEGORY_MAP } from '../../constants'
import { BackButton } from '../../components'
import PlanPriceItem from './PlanPriceItem'
import PlanWeightItem from './PlanWeightItem'
import PlanLossItem from './PlanLossItem'
import PlanServiceItem from './PlanServiceItem'

const withDependencies = (dependencies, comp) => {
  return <Form.Item noStyle dependencies={dependencies}>{comp}</Form.Item>
}

const PlanCreate = ({ router }) => {
  const [form] = Form.useForm()
  const onSubmit = v => {
    console.log(v)
  }
  const initialValues = { category: 'price' }
  const onCategorySelect = () => form.resetFields(['items'])
  return <>
    <PageHeader
      title="新增合同计算方案"
      ghost={false}
      extra={[
        <BackButton key={1} />,
        <Button type="primary" onClick={() => form.submit()}><SaveOutlined />保存</Button>
      ]}
    />
    <Form form={form} onFinish={onSubmit} initialValues={initialValues}>
      <div style={{ height: '8px' }}></div>
      <Card title="基础信息" bordered={false}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="category" label="类型">
              <Select onSelect={onCategorySelect}>
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
      <div style={{ height: '8px' }}></div>
      <Card title="方案明细" bordered={false}>
        {withDependencies(['category'], () => <Form.List name="items">
          {(fields, { add, remove }) => {
            switch (form.getFieldValue('category')) {
              case 'price':
                return <PlanPriceItem fields={fields} add={add} remove={remove} form={form} />
              case 'weight':
                return <PlanWeightItem fields={fields} add={add} remove={remove} form={form} />
              case 'loss':
                return <PlanLossItem fields={fields} add={add} remove={remove} form={form} />
              case 'service':
                return <PlanServiceItem fields={fields} add={add} remove={remove} form={form} />
              default:
                return <PlanPriceItem fields={fields} add={add} remove={remove} form={form} />
            }
          }}
        </Form.List>)}
      </Card>
    </Form>
  </>
}
export default PlanCreate