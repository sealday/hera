import { MinusCircleOutlined } from "@ant-design/icons"
import { Select, Table, Form, Button, Input, Cascader } from "antd"
import { useSelector } from "react-redux"
import { buildProductTree } from "../../../utils"
import _ from 'lodash'

const withUpdate = (shouldUpdate, comp) => {
  return <Form.Item noStyle shouldUpdate={shouldUpdate}>{comp}</Form.Item>
}

const PlanWeightItem = ({ fields, add, remove, form }) => {
  const products = useSelector(state => state.system.articles)
  const root = buildProductTree(products)
  const data = fields.map(field => ({
    _id: field.key,
    field,
  }))
  const initialValues = {}
  return <>
    <Table dataSource={data} rowKey="_id">
      <Table.Column
        title="品名"
        dataIndex="field"
        key="product"
        render={({ key, name, fieldKey, ...restField }) => {
          return withUpdate(
            (prevValues, curValues) => {
              if (prevValues.entries[name] && curValues.entries[name]) {
                return prevValues.entries[name].level !== curValues.entries[name].level
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
                options={root.children}
              />
            </Form.Item>)
        }}
      />
      <Table.Column
        title="重量"
        dataIndex="field"
        key="weight"
        render={({ key, name, fieldKey, ...restField }) => {
          return <Form.Item
            rules={[{ required: true }]}
            name={[name, 'weight']}
            fieldKey={[fieldKey, 'weight']}
            {...restField}
          >
            <Input />
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

export default PlanWeightItem