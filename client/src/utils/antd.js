import { Form, Input, Radio, Select } from "antd"
import { employeeSchema } from "../schema"

const generateFormContent = (schema) => {

  const formItems = []
  schema.forEach(item => {
    if (item.type === 'option') {
      if (item.option.type === 'fixed') {
        if (item.option.values.length < 5) {
          // 少于 5 个直接显示
          formItems.push((
            <Form.Item name={item.name} label={item.label}>
              <Radio.Group>
                {item.option.values.map(v => <Radio key={v} value={v}>{v}</Radio>)}
              </Radio.Group>
            </Form.Item>
          ))
        } else {
          // 多于 5 个下拉框显示
          formItems.push((
            <Form.Item name={item.name} label={item.label}>
              <Select>
                {item.option.values.map(v => <Select.Option key={v} value={v}>{v}</Select.Option>)}
              </Select>
            </Form.Item>
          ))
        }
      }
    } else {
      formItems.push((
        <Form.Item name={item.name} label={item.label}>
          <Input />
        </Form.Item>
      ))
    }
  })
  return formItems
}

export {
  generateFormContent
}