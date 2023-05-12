import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Checkbox, Radio, Button, Form, Input, Table, Space } from 'antd'
import React from 'react'

const styles = {
  block: { width: '100%' },
}
const rules = [{ required: true }]

const RealinfoForm = ({ fields, operation }) => {
  const form = Form.useFormInstance()
  const entriesValues = Form.useWatch('entries', form)
  const columns = [
    {
      key: 'productGroups',
      title: '产品分组',
      render: (_, field) => (
        <Form.Item name={[field.name, 'productGroups']}>
          <Checkbox.Group
            options={(entriesValues || []).map((_, index) => index + 1)}
          />
        </Form.Item>
      ),
    },
    {
      key: 'unit',
      title: '单位',
      align: 'center',
      render: (_, field, index) => (
        <Form.Item name={[field.name, 'unit']} initialValue={'千克'}>
          <Radio.Group
            key={field?.name || index}
            options={['克', '千克', '吨']}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
      ),
    },
    {
      key: 'realWeight',
      title: '过磅重量',
      align: 'center',
      width: 250,
      render: (_, field) => (
        <Form.Item name={[field.name, 'realWeight']}>
          <Input style={styles.block} />
        </Form.Item>
      ),
    },
    {
      key: 'comments',
      title: '备注',
      width: 250,
      render: (_, field) => (
        <Form.Item name={[field.name, 'comments']}>
          <Input style={styles.block} />
        </Form.Item>
      ),
    },
    {
      key: 'action',
      title: '操作',
      width: 88,
      render: (_text, field, i) => (
        <Space>
          <Button
            icon={<MinusCircleOutlined />}
            type="text"
            onClick={() => operation.remove(field.name)}
          ></Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={fields}
        pagination={false}
        size="small"
      />
      <Button
        type="dashed"
        block
        onClick={() => operation.add()}
        icon={<PlusCircleOutlined />}
      >
        增加
      </Button>
    </>
  )
}

export default RealinfoForm
