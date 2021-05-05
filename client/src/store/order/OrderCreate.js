import _ from 'lodash'
import moment from 'moment'
import { SaveOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, PageHeader, Row, Select, DatePicker, Cascader, Space, Descriptions } from 'antd'
import { IconFont} from '../../components'
import { STORE_CATEGORIES } from '../../constants'
import { buildProjectTree } from '../../utils'
import { useSelector } from 'react-redux'
import OrderItem from './OrderItem'
import { useState } from 'react'

const withDependencies = (dependencies, comp) => {
  return <Form.Item noStyle dependencies={dependencies}>{comp}</Form.Item>
}

const OrderCreate = () => {
  const [form] = Form.useForm()
  const projects = useSelector(state => state.system.projects)
  const projectRoot = buildProjectTree(projects)
  const [tabKey, setTabKey] = useState('L')
  const onSubmit = values => {
    console.log(values)
  }
  const onCategorySelect = category => {

  }
  const initialValues = {
    category: '采购入库',
    date: moment(),
  }
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
  const tabList = [
    { key: 'L', tab: '租赁' },
    { key: 'S', tab: '出售' },
    { key: 'C', tab: '赔偿' },
    { key: 'R', tab: '服务' },
  ]
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
      <Card activeTabKey={tabKey} onTabChange={setTabKey} title="明细" bordered={false} tabList={tabList} extra={[
        <Space>
          <Button shape="circle" icon={<IconFont type="iconzulinyuyue" />} />
          <Button shape="circle" icon={<IconFont type="icontubiaozhizuomoban" />} />
          <Button shape="circle" icon={<IconFont type="iconpeichangjisuan" />} />
          <Button shape="circle" icon={<IconFont type="iconweixiu" />} />
        </Space>
      ]}>
        {withDependencies(['category'], () => <Form.List name="items">
          {(fields, { add, remove }) => {
            return <OrderItem mode={tabKey} fields={fields} add={add} remove={remove} form={form} />
          }}
        </Form.List>)}
      </Card>
    </Form>
  </>
}

export default OrderCreate