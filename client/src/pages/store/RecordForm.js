import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { Badge, Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tabs, Tooltip } from "antd"
import moment from "moment"
import { DamageIcon } from '../../icon'

const RecordEntryForm = ({ fields, operation, meta, form }) => {
  const columns = [
    {
      key: 'type',
      title: '类别',
      width: 100,
      render: (_, field) => (
        <Form.Item noStyle name={[field.name, 'type']}>
          <Select>
            <Select.Option key='租赁类'>租赁类</Select.Option>
            <Select.Option key='费用类'>费用类</Select.Option>
          </Select>
        </Form.Item>
      )
    },
    {
      key: 'name',
      title: '名称',
      width: 184,
      render: (_, field) => (
        <Form.Item noStyle name={[field.name, 'name']}>
          <Select style={{ width: '12em' }}>
            <Select.Option key={1}>钢管</Select.Option>
            <Select.Option key={2}>扣件</Select.Option>
            <Select.Option key={3}>Φ48盘扣立杆</Select.Option>
          </Select>
        </Form.Item>
      )
    },
    {
      key: 'size',
      title: '规格',
      width: 184,
      render: (_, field) => (
        <Form.Item noStyle name={[field.name, 'size']}>
          <Select style={{ width: '12em' }}>
            <Select.Option key={1}>钢管</Select.Option>
            <Select.Option key={2}>扣件</Select.Option>
            <Select.Option key={3}>Φ48盘扣立杆</Select.Option>
          </Select>
        </Form.Item>
      )
    },
    {
      key: 'count',
      title: '数量',
      width: 86,
      render: (_, field) => (
        <Form.Item noStyle name={[field.name, 'count']}>
          <Input width={70} />
        </Form.Item>
      )
    },
    {
      key: 'weight',
      title: '重量',
      width: 86,
      align: 'center',
      render: () => (<span>0</span>)
    },
    {
      key: 'total',
      title: '小计',
      width: 86,
      align: 'center',
      render: () => (<span>0</span>)
    },
    {
      key: 'comments',
      title: '备注',
      render: (_, field) => (
        <Form.Item noStyle name={[field.name, 'comments']}>
          <Input style={{ width: '100%' }} />
        </Form.Item>
      )
    },
    {
      key: 'action',
      title: '操作',
      width: 180,
      render: (_, field, i) => <Space size='small'>
        <Tooltip title='删除这条记录'><Button icon={<DeleteOutlined />} type='text' onClick={() => operation.remove(field.name)}></Button></Tooltip>
        <Tooltip title='新建赔偿记录'><Button icon={<DamageIcon />} type='text' onClick={() => {
          if (typeof form.getFieldValue('loss') === 'undefined') {
            form.setFieldValue('loss', [form.getFieldValue('entries')[i]])
          } else {
            form.setFieldValue('loss', form.getFieldValue('loss').concat(form.getFieldValue('entries')[i]))
          }
        }}></Button></Tooltip>
      </Space>
    }
  ]

  return <>
    <Table columns={columns} dataSource={fields} size='small' pagination={false} />
    <Button type="dashed" block onClick={() => operation.add({ type: '租赁类' })} icon={<PlusOutlined />}>增加</Button>
  </>
}

export default () => {
  const [form] = Form.useForm()
  const entries = Form.useWatch('entries', form)
  const loss = Form.useWatch('loss', form)
  const fee = Form.useWatch('fee', form)

  const items = [
    {
      label: '出入库明细',
      key: '出入库明细',
      children: <Form.List name="entries" >
        {(fields, operation, meta) => <RecordEntryForm fields={fields} operation={operation} meta={meta} form={form} />}
      </Form.List>
    },
    {
      label: <Badge offset={[3, -3]} dot={!!loss}>赔偿明细</Badge> ,
      key: '赔偿明细',
      children: <Form.List name="loss" >
        {(fields, operation, meta) => <RecordEntryForm fields={fields} operation={operation} meta={meta} />}
      </Form.List>
    },
    {
      label: <Badge offset={[3, -3]} dot={!!fee}>费用</Badge> ,
      key: '费用',
      children: <Form.List name="fee" >
        {(fields, operation, meta) => <RecordEntryForm fields={fields} operation={operation} meta={meta} />}
      </Form.List>
    },
  ];
  return (
    <Card bordered={false}>
      <Form form={form} colon={false} labelCol={{ flex: '5em' }} labelWrap>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="仓库">
              <Input placeholder="hello" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="日期" wrapperCol={{ flex: 'auto' }}>
              <DatePicker defaultValue={moment()} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="原始单号">
              <Input placeholder="hello" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="车号">
              <Input placeholder="hello" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="备注">
              <Input.TextArea placeholder="hello" rows={2} />
            </Form.Item>
          </Col>
        </Row>
        <Tabs items={items} />
      </Form>
    </Card>
  )
}