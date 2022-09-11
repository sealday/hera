import { Form, Select } from "antd"
import _ from "lodash"
import { Error, Loading } from "."
import heraApi from "../api"

export default ({ item }) => {
  const { ref, label, value } = item.option
  const result = heraApi[`useGet${_.capitalize(ref)}ListQuery`]()
  if (result.isError) {
    return <Error />
  }
  if (result.isLoading) {
    return <Loading />
  }
  return (
    <Form.Item key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden}>
      <Select disabled={item.disabled}>
        {result.data.map(v => <Select.Option key={v[value]} value={v[value]}>{v[label]}</Select.Option>)}
      </Select>
    </Form.Item>
  ) 
}