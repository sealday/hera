import _ from 'lodash'
import {
  Card,
  Form,
  Input,
  Select,
  Row,
  Col,
} from 'antd'

import { PLAN_CATEGORY_MAP } from '../../../constants'
import PlanPriceItem from './PlanPriceItem'
import PlanWeightItem from './PlanWeightItem'
import PlanLossItem from './PlanLossItem'
import PlanServiceItem from './PlanServiceItem'

const withDependencies = (dependencies, comp) => {
  return <Form.Item noStyle dependencies={dependencies}>{comp}</Form.Item>
}

export default ({ initialValues, onSubmit: onFinalSubmit, form: formRef }) => {
  const [form] = Form.useForm()
  // 初始化 form 引用
  if (typeof formRef !== 'undefined' && !formRef.current) {
    formRef.current = form
  }
  const onSubmit = (v) => {
    const plan = { ...v }
    plan.entries = v.entries.map(item => ({ ...item, type: item.product[0], name: item.product[1], size: item.product[2] }))
    onFinalSubmit(plan)
  }
  const onCategorySelect = () => form.resetFields(['entries'])
  return (
    <Form form={form} onFinish={onSubmit} initialValues={initialValues}>
      <div style={{ height: '8px' }}></div>
      <Card title="基础信息" bordered={false}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="type" label="类型">
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
      <Form.Item noStyle dependencies={['type']}>
        {() => form.getFieldValue('type') === 'price' && <>
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
        {withDependencies(['type'], () => <Form.List name="entries">
          {(fields, { add, remove }) => {
            switch (form.getFieldValue('type')) {
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
  )
}