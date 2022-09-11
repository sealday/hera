import { Col, DatePicker, Form, Input, Radio, Row, Select } from "antd"
import { RefSelect } from "../components"

const genFormContent = (schema, cols = 0) => {
  const formItems = []
  schema.forEach(item => {
    if (item.option) {
      if (item.option.type === 'static_value_only') {
        if (item.option.values.length < 5) {
          // 少于 5 个直接显示
          formItems.push((
            <Form.Item key={item.name} name={item.name} label={item.label} required={item.required}>
              <Radio.Group>
                {item.option.values.map(v => <Radio key={v} value={v}>{v}</Radio>)}
              </Radio.Group>
            </Form.Item>
          ))
        } else {
          // 多于 5 个下拉框显示
          formItems.push((
            <Form.Item key={item.name} name={item.name} label={item.label} required={item.required}>
              <Select>
                {item.option.values.map(v => <Select.Option key={v} value={v}>{v}</Select.Option>)}
              </Select>
            </Form.Item>
          ))
        }
      } else if (item.option.type === 'ref') {
          formItems.push((
            <RefSelect item={item} key={item.name} />
          ))
      }
    } else if (item.type === 'boolean') {
      formItems.push((
        <Form.Item key={item.name} name={item.name} label={item.label} required={item.required}>
          <Radio.Group>
            <Radio key='是' value={true}>是</Radio>
            <Radio key='否' value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
      ))
    } else if (item.type === 'date') {
      formItems.push((
        <Form.Item key={item.name} name={item.name} label={item.label} required={item.required}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      ))
    } else {
      formItems.push((
        <Form.Item key={item.name} name={item.name} label={item.label} required={item.required}>
          <Input addonAfter={item.suffix ? item.suffix : null} />
        </Form.Item>
      ))
    }
  })
  console.dir(formItems)

  // 处理排版逻辑
  if (cols) {
    const colSpan = 24 / cols
    return (
      <Row gutter={24}>
        {
          formItems.map((item, i) => (
            <Col span={schema.find(schemaItem => schemaItem.name === item.key).col === 'fullwidth' ? 24 : colSpan} key={item.key}>
              {item}
            </Col>
          ))
        }
      </Row>
    )
  }

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
  genFormContent,
  genTableColumn,
}