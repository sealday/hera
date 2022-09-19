import { Cascader, Form } from "antd"
import _ from "lodash"
import { Error, Loading } from "."
import heraApi from "../api"
import { buildTree } from "../utils"

export default ({ item, noStyle, customBuild, style, rules }) => {
  const { ref, label: labelKey, value: valueKey } = item.option
  const result = heraApi[`useGet${_.capitalize(ref)}ListQuery`]()
  if (result.isError) {
    return <Error />
  }
  if (result.isLoading) {
    return <Loading />
  }
  if (customBuild) {
    const options = customBuild(result.data)
    return (
      <Form.Item initialValue={item.default} noStyle={noStyle} key={item.name} name={item.name} label={item.label} hidden={item.hidden} rules={[{ required: item.required }]}>
        <Cascader expandTrigger="hover" style={noStyle ? { width: '100%' } : null} showSearch options={options} />
      </Form.Item>
    )
  } else {
    const items = result.data.map(item => ({ label: item[labelKey], value: item[valueKey], id: item.id, parentId: item.parentId }))
    const options = buildTree(items)
    return (
      <Form.Item initialValue={item.default} noStyle={noStyle} key={item.name} name={item.name} label={item.label} hidden={item.hidden} rules={[{ required: item.required }]}>
        <Cascader expandTrigger="hover" showSearch options={options} />
      </Form.Item>
    )
  }
}