import { Form, Select } from "antd"
import _ from "lodash"
import { Error, Loading, smartFilterOption } from "."
import heraApi from "../api"

const RefSelectComponent = ({ item, noStyle }) => {
  const { ref, label, value } = item.option
  const form = Form.useFormInstance()
  const result = heraApi[`useGet${_.capitalize(ref)}ListQuery`]()
  if (result.isError) {
    return <Error />
  }
  if (result.isLoading) {
    return <Loading />
  }
  if (item.option.filters && form) {
    const namePath = _.map(item.option.filters, item => item.value)
    return (
      <Form.Item noStyle dependencies={namePath}>
        {() => {
          const filters = _.map(item.option.filters, item => ({ name: item.name, value: form.getFieldValue(item.value) }))
          let data = _.chain(result.data)
          data = data.filter(record => _.every(filters, filter => record[filter.name] === filter.value))
          data = data.uniqBy(value)
          // 转换
          data = data.map(item => ({ label: item[label], value: item[value], pinyin: item.pinyin }))
          const options = data.value()
          return (
            <Form.Item initialValue={item.default} noStyle={noStyle} key={item.name} name={item.name} label={item.label} hidden={item.hidden} rules={[{ required: item.required }]}>
              <Select
                disabled={item.disabled}
                showSearch
                style={{
                  width: item.width,
                }}
                options={options}
                filterOption={smartFilterOption} />
            </Form.Item>
          )
        }}
      </Form.Item>
    )
  } else {
    // FIXME 处理过滤去重逻辑
    let data = _.chain(result.data)
    if (item.filter) {
      data = data.filter(record => record[item.filter.key] === item.filter.value)
    }
    data = data.uniqBy(value)
    // 转换
    data = data.map(item => ({ label: item[label], value: item[value], pinyin: item.pinyin }))
    const options = data.value()
    return (
      <Form.Item initialValue={item.default} noStyle={noStyle} key={item.name} name={item.name} label={item.label} hidden={item.hidden} rules={[{ required: item.required }]}>
        <Select
          disabled={item.disabled}
          showSearch
          style={{
            width: item.width,
          }}
          options={options}
          filterOption={smartFilterOption}
        />
      </Form.Item>
    )
  }
}

export default RefSelectComponent
