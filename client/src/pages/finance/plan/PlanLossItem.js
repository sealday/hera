import { MinusCircleOutlined } from "@ant-design/icons"
import { Select, Table, Form, Button, Input, Cascader } from "antd"
import { useSelector } from "react-redux"
import { buildProductTree } from "../../../utils"
import _ from 'lodash'

const withUpdate = (shouldUpdate, comp) => {
  return <Form.Item noStyle shouldUpdate={shouldUpdate}>{comp}</Form.Item>
}

const PlanLossItem = ({ fields, add, remove, form }) => {
  const products = useSelector(state => state.system.articles)
  const root = buildProductTree(products)
  const rootWithoutSize = buildProductTree(products, false)
  const data = fields.map(field => ({
    _id: field.key,
    field,
  }))
  const isLevelName = (name) => {
    return form.getFieldValue(['items', name, 'level']) === '产品'
  }
  const initialValues = {
    level: '产品',
    type: '数量',
  }
  return <>
    <Table dataSource={data} rowKey="_id">
      <Table.Column
        title="赔偿类型"
        dataIndex="field"
        key="lossType"
        render={({ key, name, fieldKey, ...restField }) => {
          return <Form.Item
            name={[name, 'lossType']}
            fieldKey={[fieldKey, 'lossType']}
            rules={[{ required: true }]}
            {...restField}
          >
            <Select
              style={{ minWidth: '6em' }}
            >
              <Select.Option key="全额赔偿" value="全额赔偿">全额赔偿</Select.Option>
              <Select.Option key="部分赔偿" value="部分赔偿">部分赔偿</Select.Option>
            </Select>
          </Form.Item>
        }}
      />
      <Table.Column
        title="定价层级"
        dataIndex="field"
        key="level"
        render={({ key, name, fieldKey, ...restField }) => {
          return <Form.Item
            name={[name, 'level']}
            fieldKey={[fieldKey, 'level']}
            rules={[{ required: true }]}
            {...restField}
          >
            <Select
              onSelect={() => {
                form.resetFields([['items', name, 'product']])
              }}
              style={{ minWidth: '8em' }}
            >
              <Select.Option key="产品" value="产品">定价到产品</Select.Option>
              <Select.Option key="规格" value="规格">定价到规格</Select.Option>
            </Select>
          </Form.Item>
        }}
      />
      <Table.Column
        title="品名"
        dataIndex="field"
        key="product"
        render={({ key, name, fieldKey, ...restField }) => {
          return withUpdate(
            (prevValues, curValues) => {
              if (prevValues.items[name] && curValues.items[name]) {
                return prevValues.items[name].level !== curValues.items[name].level
              } else {
                return true
              }
            }
            , () => <Form.Item
              rules={[{ required: true }]}
              name={[name, 'product']}
              fieldKey={[fieldKey, 'product']}
              {...restField}
            >
              <Cascader
                style={{ minWidth: '21em' }}
                showSearch
                options={isLevelName(name) ? rootWithoutSize.children : root.children}
              />
            </Form.Item>)
        }}
      />
      <Table.Column
        title="单价"
        dataIndex="field"
        key="unitPrice"
        render={({ key, name, fieldKey, ...restField }) => {
          return <Form.Item
            rules={[{ required: true }]}
            name={[name, 'unitPrice']}
            fieldKey={[fieldKey, 'unitPrice']}
            {...restField}
          >
            <Input />
          </Form.Item>
        }}
      />
      <Table.Column
        title="计算类型"
        dataIndex="field"
        key="type"
        render={({ key, name, fieldKey, ...restField }) => {
          return <Form.Item
            rules={[{ required: true }]}
            name={[name, 'type']}
            fieldKey={[fieldKey, 'type']}
            {...restField}
          >
            <Select
              style={{ minWidth: '12em' }}
            >
              <Select.Option value="数量">根据数量计算</Select.Option>
              <Select.Option value="换算数量">根据换算后数量计算</Select.Option>
              <Select.Option value="重量">根据理论重量计算</Select.Option>
            </Select>
          </Form.Item>
        }}
      />
      <Table.Column
        title="备注"
        dataIndex="field"
        key="comments"
        render={({ key, name, fieldKey, ...restField }) => {
          return <Form.Item
            name={[name, 'comments']}
            fieldKey={[fieldKey, 'comments']}
            {...restField}
          >
            <Input />
          </Form.Item>
        }}
      />
      <Table.Column
        title="操作"
        dataIndex="field"
        key="action"
        render={({ name }) => {
          return <Button type="text" onClick={() => remove(name)}><MinusCircleOutlined /></Button>
        }}
      />
    </Table>
    <Button block type="dashed" onClick={() => { add(initialValues) }} >增加</Button>
  </>
}

export default PlanLossItem