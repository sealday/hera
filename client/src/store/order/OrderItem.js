import { MinusCircleOutlined } from "@ant-design/icons"
import { Select, Table, Form, Button, Input, Cascader, Descriptions } from "antd"
import { useSelector } from "react-redux"
import { buildProductTree } from "../../utils"
import _ from 'lodash'

const withUpdate = (shouldUpdate, comp) => {
  return <Form.Item noStyle shouldUpdate={shouldUpdate}>{comp}</Form.Item>
}

const withDependencies = (dependencies, comp) => {
  return <Form.Item noStyle dependencies={dependencies}>{comp}</Form.Item>
}

const OrderItem = ({ fields, add, remove, mode, form }) => {
  const products = useSelector(state => state.system.articles)
  const root = buildProductTree(products, true, true)
  const data = fields
    .filter(field => form.getFieldValue(['items', field.name, 'mode']) === mode)
    .map(field => ({
      _id: field.key,
      field,
    }))
  const initialValues = {
    mode,
  }
  const footer = <Descriptions title="小结">
    <Descriptions.Item title="钢管">钢管 73.6 米 0.223 吨</Descriptions.Item>
  </Descriptions>
  return <>
    <Table dataSource={data} rowKey="_id" size="small" footer={() => footer}>
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
              wrapperCol={{ span: 24 }}
              rules={[{ required: true }]}
              name={[name, 'product']}
              fieldKey={[fieldKey, 'product']}
              {...restField}
            >
              <Cascader
                style={{ minWidth: '21em' }}
                showSearch
                options={root.children}
              />
            </Form.Item>)
        }}
      />
      <Table.Column
        title="数量"
        dataIndex="field"
        key="count"
        render={({ key, name, fieldKey, ...restField }) => {
          return <Form.Item
            wrapperCol={{ span: 24 }}
            name={[name, 'count']}
            fieldKey={[fieldKey, 'count']}
            {...restField}
          >
            <Input />
          </Form.Item>
        }}
      />
      <Table.Column
        title="小计"
        dataIndex="field"
        key="subtotal"
        render={({ key, name, fieldKey }) => {
          return <span style={{ display: 'inline-block', minWidth: '2em' }}>小计</span>
        }}
      />
      <Table.Column
        title="单位"
        dataIndex="field"
        key="unit"
        render={({ key, name, fieldKey }) => {
          return withDependencies([['items', name, 'product']], () => <span style={{ display: 'inline-block', minWidth: '2em' }}>单位</span>)
        }}
      />
      <Table.Column
        title="单价"
        dataIndex="field"
        key="unitPrice"
        render={({ key, name, fieldKey, ...restField }) => {
          return <Form.Item
            wrapperCol={{ span: 24 }}
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
        title="金额"
        dataIndex="field"
        key="sum"
        render={({ key, name, fieldKey }) => {
          return <span style={{ display: 'inline-block', minWidth: '2em' }}>金额</span>
        }}
      />
      <Table.Column
        title="备注"
        dataIndex="field"
        key="comments"
        render={({ key, name, fieldKey, ...restField }) => {
          return <Form.Item
            wrapperCol={{ span: 24 }}
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

export default OrderItem