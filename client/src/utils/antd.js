import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Col, DatePicker, Form, Input, Radio, Row, Select, Table } from "antd"
import _ from "lodash"
import moment from "moment"
import { DepLabel, RefCascader, RefCascaderLabel, RefLabel, RefSelect } from "../components"

const ListTable = ({ fields, operation, meta, item, form}) => {
  const columns = genTableFormColumn(item, form).concat([
    {
      key: 'action',
      title: '操作',
      render(_text, field) {
        return (
          <Button type='text' icon={<MinusCircleOutlined />} onClick={() => operation.remove(field.name)} />
        )
      }
    }
  ])
  return (
    <>
      <Table title={() => item.label} columns={columns} dataSource={fields} pagination={false} />
      <Button type="dashed" block icon={<PlusCircleOutlined />} onClick={() => operation.add()}>新增</Button>
    </>
  )
}
          
const genFormContent = (schema, cols = 0, form = null, initialValues = {}) => {
  const formItems = []
  schema.forEach(item => {
    if (item.default) {
      initialValues[item.name] = item.default
    }
    if (item.option) {
      if (item.option.type === 'static_value_only') {
        if (item.option.values.length < 5) {
          // 少于 5 个直接显示
          formItems.push((
            <Form.Item key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden} rules={[{ required: item.required }]}>
              <Radio.Group disabled={item.disabled}>
                {item.option.values.map(v => <Radio key={v} value={v}>{v}</Radio>)}
              </Radio.Group>
            </Form.Item>
          ))
        } else {
          // 多于 5 个下拉框显示
          formItems.push((
            <Form.Item key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden} rules={[{ required: item.required }]}>
              <Select disabled={item.disabled}>
                {item.option.values.map(v => <Select.Option key={v} value={v}>{v}</Select.Option>)}
              </Select>
            </Form.Item>
          ))
        }
      } else if (item.option.type === 'ref') {
        if (item.option.select === 'cascader') {
          formItems.push((
            <RefCascader item={item} key={item.name} />
          ))
        } else {
          formItems.push((
            <RefSelect item={item} key={item.name} form={form} />
          ))
        }
      }
    } else if (item.type === 'boolean') {
      formItems.push((
        <Form.Item key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden} rules={[{ required: item.required }]}>
          <Radio.Group disabled={item.disabled}>
            <Radio key='是' value={true}>是</Radio>
            <Radio key='否' value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
      ))
    } else if (item.type === 'date') {
      formItems.push((
        <Form.Item key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden} rules={[{ required: item.required }]}>
          <DatePicker style={{ width: '100%' }} disabled={item.disabled}/>
        </Form.Item>
      ))
    } else if (item.type === 'dateRange') {
      formItems.push((
        <Form.Item key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden} rules={[{ required: item.required }]}>
          <DatePicker.RangePicker style={{ width: '100%' }} disabled={item.disabled}/>
        </Form.Item>
      ))
    } else if (item.type === 'list') {
      formItems.push((
        <Form.List key={item.name} name={item.name} rules={[{ required: item.required }]} noStyle>
          {(fields, operation, meta) => <ListTable fields={fields} operation={operation} meta={meta} item={item} form={form} />}
        </Form.List>
      ))
    } else {
      if (item.rows) {
        formItems.push((
          <Form.Item key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden} rules={[{ required: item.required }]}>
            <Input.TextArea disabled={item.disabled} rows={item.rows} />
          </Form.Item>
        ))
      } else {
        formItems.push((
          <Form.Item key={item.name} name={item.name} label={item.label} required={item.required} hidden={item.hidden} rules={[{ required: item.required }]}>
            <Input addonAfter={item.suffix ? item.suffix : null} disabled={item.disabled} />
          </Form.Item>
        ))
      }
    }
  })

  const isFullwidth = (item) => {
    const schemaItem = schema.find(schemaItem => schemaItem.name === item.key)
    return schemaItem.col === 'fullwidth' || schemaItem.type === 'list'
  }

  // 处理排版逻辑
  if (cols) {
    const colSpan = 24 / cols
    return (
      <Row gutter={24}>
        {
          formItems.map((item, i) => (
            <Col span={isFullwidth(item) ? 24 : colSpan} key={item.key}>
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
          if (item.option.select === 'cascader') {
            column.render = v => <RefCascaderLabel item={item} value={v} />
          } else {
            column.render = v => <RefLabel item={item} value={v} />
          }
        } else if (item.option.type === 'static') {
          const kv = _.zipObject(item.option.values, item.option.labels)
          column.render = k => kv[k]
        }
      }
      columns.push(column)
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

const genTableFormColumn = (parent, form = null) => {
  const schema = parent.schema
  const columns = []
  schema.forEach(item => {
    const column = { title: item.label, key: item.name, render: null }
    if (item.option) {
      if (item.option.type === 'static_value_only') {
        column.render = (_text, field) => (
          <Form.Item initialValue={item.default} noStyle name={[field.name, item.name]} label={item.label} required={item.required} hidden={item.hidden} rules={[{ required: item.required }]}>
            <Select disabled={item.disabled}>
              {item.option.values.map(v => <Select.Option key={v} value={v}>{v}</Select.Option>)}
            </Select>
          </Form.Item>
        )
      } else if (item.option.type === 'static') {
        
        column.render = (_text, field) => (
          <Form.Item initialValue={item.default} noStyle name={[field.name, item.name]} label={item.label} hidden={item.hidden} rules={[{ required: item.required }]}>
            <Select disabled={item.disabled}>
              {_
                .zip(item.option.labels, item.option.values)
                .map(([label, value]) => <Select.Option key={value} value={value}>{label}</Select.Option>)}
            </Select>
          </Form.Item>
        )
      } else if (item.option.type === 'ref') {
        if (item.option.select === 'cascader') {
          column.render = (_text, field) => (
            <RefCascader noStyle item={{ ...item, name: [field.name, item.name] }} key={item.name} />
          )
        } else {
          column.render = (_text, field) => (
            <RefSelect noStyle item={{ ...item, name: [field.name, item.name] }} key={item.name} />
          )
        }
      }
    } else if (item.type === 'boolean') {
      column.render = (_text, field) => (
        <Form.Item initialValue={item.default} noStyle name={[field.name, item.name]} label={item.label} hidden={item.hidden} rules={[{ required: item.required }]}>
          <Select disabled={item.disabled}>
            {item.option.values.map(v => <Select.Option key={v} value={v}>{v}</Select.Option>)}
            <Select.Option key='是' value={true}>是</Select.Option>
            <Select.Option key='否' value={false}>否</Select.Option>
          </Select>
        </Form.Item>
      )
    } else if (item.type === 'date') {
      column.render = (_text, field) => (
        <Form.Item initialValue={item.default} noStyle name={[field.name, item.name]} label={item.label} hidden={item.hidden} rules={[{ required: item.required }]}>
          <DatePicker disabled={item.disabled} />
        </Form.Item>
      )
    } else {
      if (item.formula) {
        column.render = (_text, field) => (
          <DepLabel form={form} field={field} item={item} parent={parent} />
        )
      } else {
        column.render = (_text, field) => (
          <Form.Item initialValue={item.default} noStyle name={[field.name, item.name]} label={item.label} hidden={item.hidden} rules={[{ required: item.required }]}>
            <Input addonAfter={item.suffix ? item.suffix : null} disabled={item.disabled} />
          </Form.Item>
        )
      }
    }
    columns.push(column)
  })
  return columns
}

export {
  genFormContent,
  genTableColumn,
}