import { Form, Input, Radio, Select } from "antd"

const generateFormContent = (schema) => {

  const formItems = []
  schema.forEach(item => {
    if (item.option) {
      if (item.option.type === 'static_value_only') {
        if (item.option.values.length < 5) {
          // 少于 5 个直接显示
          formItems.push((
            <Form.Item key={item.name} name={item.name} label={item.label}>
              <Radio.Group>
                {item.option.values.map(v => <Radio key={v} value={v}>{v}</Radio>)}
              </Radio.Group>
            </Form.Item>
          ))
        } else {
          // 多于 5 个下拉框显示
          formItems.push((
            <Form.Item key={item.name} name={item.name} label={item.label}>
              <Select>
                {item.option.values.map(v => <Select.Option key={v} value={v}>{v}</Select.Option>)}
              </Select>
            </Form.Item>
          ))
        }
      }
    } else if (item.type === 'boolean') {
      formItems.push((
        <Form.Item key={item.name} name={item.name} label={item.label}>
          <Radio.Group>
            <Radio key='是' value={true}>是</Radio>
            <Radio key='否' value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
      ))
    } else {
      formItems.push((
        <Form.Item key={item.name} name={item.name} label={item.label}>
          <Input addonAfter={item.suffix ? item.suffix : null} />
        </Form.Item>
      ))
    }
  })
  return formItems
}

const genTableColumn = schema => {
  const columns = []
  schema.forEach(item => {
    if (item.type === 'text') {
      columns.push({ title: item.label, dataIndex: item.name, key: item.name })
    } else if (item.type === 'boolean') {
      columns.push({ title: item.label, dataIndex: item.name, key: item.name, render(v) { return v ? '是' : '否' } })
    } else if (item.type === 'number') {
      columns.push({ title: item.label, dataIndex: item.name, key: item.name })
    }
  })
  return columns
}

export {
  generateFormContent,
  genTableColumn,
}