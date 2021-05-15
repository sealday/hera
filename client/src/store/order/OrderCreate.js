import _ from 'lodash'
import moment from 'moment'
import { SaveOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, PageHeader, Row, Select, DatePicker, Cascader, Space, Descriptions } from 'antd'
import { IconFont} from '../../components'
import { STORE_CATEGORIES } from '../../constants'
import { buildProjectTree, parseMode } from '../../utils'
import { useSelector } from 'react-redux'
import OrderItem from './OrderItem'
import { useState } from 'react'
import orderConfig, { DEFAULT_ORDER_CATEGORY, MODE_FIELDS_MAP } from './config'

const withDependencies = (dependencies, comp) => {
  return <Form.Item noStyle dependencies={dependencies}>{comp}</Form.Item>
}

const OrderCreate = () => {
  const [form] = Form.useForm()
  const projects = useSelector(state => state.system.projects)
  const store = useSelector(state => state.system.store)
  const projectRoot = buildProjectTree(projects)
  const [tabKey, setTabKey] = useState(orderConfig[DEFAULT_ORDER_CATEGORY].defaultMode)
  const onSubmit = values => {
    console.log(values)
  }
  const onCategorySelect = category => {
    if (category.endsWith('入库')) {
      form.setFieldsValue({
        inProject: [store.type, store._id],
        outProject: undefined,
      })
    } else if (category.endsWith('出库')) {
      form.setFieldsValue({
        inProject: undefined,
        outProject: [store.type, store._id],
      })
    }
    // 重置明细
    form.setFieldsValue({ items: [] })
    setTabKey(orderConfig[category].defaultMode)
  }
  const initialValues = {
    category: DEFAULT_ORDER_CATEGORY,
    outProject: [store.type, store._id],
    date: moment(),
  }
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
  const getTabList = modes => {
    return modes.map(mode => ({
      key: mode, tab: parseMode(mode)
    }))
  }
  return <>
    <Form {...layout} form={form} onFinish={onSubmit} initialValues={initialValues}>
      {withDependencies(['category'], () =>
        <PageHeader
          title={`新增${form.getFieldValue('category')}单`}
          ghost={false}
          extra={[
            <Button key={1} type="primary" onClick={() => form.submit()}><SaveOutlined />保存</Button>
          ]}
        />
      )}
      <div style={{ height: '8px' }}></div>
      <Card title="基础信息" bordered={false}>
        <Row>
          <Col span={8}>
            <Form.Item name="category" label="类型">
              <Select onSelect={onCategorySelect}>
                {STORE_CATEGORIES.map(name => <Select.Option value={name} key={name}>{name}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="date" label="日期">
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item name="outProject" label="出库">
              <Cascader showSearch options={projectRoot.children}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="inProject" label="入库">
              <Cascader showSearch options={projectRoot.children}/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} name="comments" label="备注">
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <div style={{ height: '8px' }}></div>
      <Card title="补充信息" bordered={false}>
        <Row>
          <Col span={8}>
            <Form.Item name="no" label="原始单号">
              <Select>
                <Select.Option>hi</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="name" label="车号">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <div style={{ height: '8px' }}></div>
      {withDependencies(['category'], () => <>
        <Card activeTabKey={tabKey} onTabChange={setTabKey} title="明细" bordered={false} 
          tabList={getTabList(orderConfig[form.getFieldValue('category')].modes)}
          extra={[
          <Space>
              {orderConfig[form.getFieldValue('category')].modes.map(mode => <Button
                shape="circle"
                key={mode}
                icon={<IconFont type={MODE_FIELDS_MAP[mode].icon} />}
              />)}
          </Space>
        ]}>
          <Form.List name="items">
            {(fields, { add, remove }) => {
              return <OrderItem mode={tabKey} fields={fields} add={add} remove={remove} form={form} />
            }}
          </Form.List>
        </Card>
      </>)}
    </Form>
  </>
}

export default OrderCreate