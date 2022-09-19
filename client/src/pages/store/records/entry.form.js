import { MinusCircleOutlined, PaperClipOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Form, Input, Space, Table, Tooltip } from "antd"
import _ from "lodash"
import { RefCascader } from "../../../components"
import { buildProductTree } from "../../../utils"
import React, { useContext } from 'react';
import { SettingContext } from "."

const styles = {
  block: { width: '100%' }
}
const rules = [{ required: true }]

export default ({ fields, operation, meta }) => {
  const form = Form.useFormInstance()
  const settings = useContext(SettingContext)
  const columns = []
  columns.push({
    key: 'product',
    title: '产品',
    width: 300,
    render: (_, field) => (
      <RefCascader
        noStyle
        item={{ required: true, name: [field.name, 'product'], option: { ref: 'product' } }}
        customBuild={data => buildProductTree(data).children}
      />
    )
  })
  columns.push({
    key: 'count',
    title: '数量',
    width: 100,
    render: (_, field) => (
      <Form.Item name={[field.name, 'count']} rules={rules}>
        <Input style={styles.block} />
      </Form.Item>
    )
  })
  if (settings.price) {
    columns.push({
      key: 'price',
      title: '单价',
      width: 100,
      render: (_, field) => (
        <Form.Item name={[field.name, 'price']} rules={rules}>
          <Input style={styles.block} />
        </Form.Item>
      )
    })
  }
  columns.push({
    key: 'comments',
    title: '备注',
    render: (_, field) => (
      <Form.Item name={[field.name, 'comments']}>
        <Input style={styles.block} />
      </Form.Item>
    )
  })
  columns.push({
    key: 'action',
    title: '操作',
    width: 180,
    render: (_text, field, i) => <Space>
      <Button icon={<MinusCircleOutlined />} type='text' onClick={() => operation.remove(field.name)}></Button>
      <Tooltip title='新增关联'><Button icon={<PaperClipOutlined />} type='text' onClick={() => {
        const product = form.getFieldValue('entries')[i].product
        if (_.isEmpty(product)) return;
        const complement = { level: 'associated', associate: JSON.stringify(product) }
        if (typeof form.getFieldValue('complements') === 'undefined') {
          form.setFieldValue('complements', [complement])
        } else {
          form.setFieldValue('complements', form.getFieldValue('complements').concat(complement))
        }
      }}></Button></Tooltip>
    </Space>
  })
  return <>
    <Table columns={columns} dataSource={fields} pagination={false} size='small' />
    <Button type="dashed" block onClick={() => operation.add()} icon={<PlusCircleOutlined />}>增加</Button>
  </>
}