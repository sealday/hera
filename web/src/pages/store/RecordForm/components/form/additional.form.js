import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space, Table } from 'antd'
import _ from 'lodash'
import { RefCascader } from '../../../../../components'
import React from 'react'

const styles = {
  block: { width: '100%' },
}
const rules = [{ required: true }]

const AdditionalForm = ({ fields, operation, meta }) => {
  const columns = [
    {
      key: 'content',
      title: '摘要',
      width: 300,
      render: (_, field) => (
        <Form.Item name={[field.name, 'content']} rules={rules}>
          <Input style={styles.block} />
        </Form.Item>
      ),
    },
    {
      key: 'product',
      title: '计费项目',
      width: 180,
      render: (_, field) => (
        <RefCascader
          item={{
            name: [field.name, 'product'],
            option: { ref: 'other', label: 'name', value: 'id' },
          }}
          rules={rules}
        />
      ),
    },
    {
      key: 'amount',
      title: '金额',
      width: 120,
      render: (_, field) => (
        <Form.Item name={[field.name, 'amount']} rules={rules}>
          <Input style={styles.block} suffix="元" />
        </Form.Item>
      ),
    },
    {
      key: 'comments',
      title: '备注',
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
      render: (_, field, i) => (
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
        size="small"
        pagination={false}
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

export default AdditionalForm
