import { Cascader, Form, Select } from "antd"
import _ from "lodash"
import { Error, Loading } from "."
import heraApi from "../api"
import { buildTree } from "../utils"

export default ({ item, noStyle }) => {
  const { ref, label: labelKey, value: valueKey } = item.option
  const result = heraApi[`useGet${_.capitalize(ref)}ListQuery`]()
  if (result.isError) {
    return <Error />
  }
  if (result.isLoading) {
    return <Loading />
  }
  const items = result.data.map(item => ({ label: item[labelKey], value: item[valueKey], id: item.id, parentId: item.parentId }))
  const options = buildTree(items)
  return (
    <Form.Item initialValue={item.default} noStyle={noStyle} key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden} rules={[{ required: item.required }]}>
      <Cascader options={options} />
    </Form.Item>
  ) 
}