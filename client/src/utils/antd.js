import { Col, DatePicker, Form, Input, Radio, Row, Select } from "antd"
import moment from "moment"
import { RefLabel, RefSelect } from "../components"

const genFormContent = (schema, cols = 0) => {
  const formItems = []
  schema.forEach(item => {
    if (item.option) {
      if (item.option.type === 'static_value_only') {
        if (item.option.values.length < 5) {
          // 少于 5 个直接显示
          formItems.push((
            <Form.Item key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden}>
              <Radio.Group disabled={item.disabled}>
                {item.option.values.map(v => <Radio key={v} value={v}>{v}</Radio>)}
              </Radio.Group>
            </Form.Item>
          ))
        } else {
          // 多于 5 个下拉框显示
          formItems.push((
            <Form.Item key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden}>
              <Select disabled={item.disabled}>
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
        <Form.Item key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden}>
          <Radio.Group disabled={item.disabled}>
            <Radio key='是' value={true}>是</Radio>
            <Radio key='否' value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
      ))
    } else if (item.type === 'date') {
      formItems.push((
        <Form.Item key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden}>
          <DatePicker style={{ width: '100%' }} disabled={item.disabled}/>
        </Form.Item>
      ))
    } else {
      formItems.push((
        <Form.Item key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden}>
          <Input addonAfter={item.suffix ? item.suffix : null} disabled={item.disabled}/>
        </Form.Item>
      ))
    }
  })

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
    if (item.hidden) return;
    if (item.type === 'text') {
      const column = { title: item.label, dataIndex: item.name, key: item.name }
      if (item.option) {
        if (item.option.type === 'ref') {
          column.render = v => <RefLabel item={item} value={v} />
        }
      }
      columns.push(column)
      // moment(outDate).format('YYYY-MM-DD')
    } else if (item.type === 'date') {
      const column = { title: item.label, dataIndex: item.name, key: item.name, render: null }
      column.render = date => moment(date).format('YYYY-MM-DD')
      columns.push(column)
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