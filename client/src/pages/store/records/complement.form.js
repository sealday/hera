import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Form, Input, Select, Space, Table } from "antd"
import _ from "lodash"
import { RefCascader } from "../../../components"
import { buildProductTree } from "../../../utils"
import React from 'react';

const styles = {
  block: { width: '100%' }
}
const rules = [{ required: true }]

export default ({ fields, operation, meta, form }) => {
  const entries = Form.useWatch(['entries'])
  const levelOptions = [
    { label: '关联', value: 'associated' },
    { label: '补充', value: 'unconnected' },
  ]
  const associateOptions = _.chain(entries)
    .filter(entry => !_.isEmpty(entry) && !_.isEmpty(entry.product))
    .map(entry => ({ label: entry.product.join(' / '), value: JSON.stringify(entry.product) }))
    .value()
  const columns = [
    {
      key: 'level',
      title: '层级',
      width: 86,
      render: (_, field) => (
        <Form.Item name={[field.name, 'level']} rules={rules}>
          <Select options={levelOptions} style={styles.block} />
        </Form.Item>
      )
    },
    {
      key: 'associate',
      title: '关联',
      width: 300,
      render: (_, field) => (
        <Form.Item dependencies={[['complements', field.name, 'level']]} >
          {() => {
            const isEnabled = form.getFieldValue(['complements', field.name, 'level']) === 'associated'
            return (
              <Form.Item name={[field.name, 'associate']} rules={isEnabled ? rules : []}>
                <Select options={associateOptions} style={styles.block} disabled={!isEnabled} />
              </Form.Item>
            )
          }}
        </Form.Item>
      )
    },

    {
      key: 'product',
      title: '项目',
      width: 300,
      render: (_, field) => (
        <RefCascader
          item={{ name: [field.name, 'product'], option: { ref: 'product' } }}
          rules={rules}
          customBuild={data => buildProductTree(data).children}
        />
      )
    },
    {
      key: 'count',
      title: '数量',
      width: 100,
      render: (_, field) => (
        <Form.Item name={[field.name, 'count']} rules={rules}>
          <Input style={styles.block} />
        </Form.Item>
      )
    },
    {
      key: 'comments',
      title: '备注',
      render: (_, field) => (
        <Form.Item name={[field.name, 'comments']}>
          <Input style={styles.block} />
        </Form.Item>
      )
    },
    {
      key: 'action',
      title: '操作',
      width: 180,
      render: (_, field, i) => <Space>
        <Button icon={<MinusCircleOutlined />} type='text' onClick={() => operation.remove(field.name)}></Button>
      </Space>
    }
  ]

  return <>
    <Table columns={columns} dataSource={fields} size='small' pagination={false} />
    <Button type="dashed" block onClick={() => operation.add({ level: 'unconnected' })} icon={<PlusCircleOutlined />}>增加</Button>
  </>
}