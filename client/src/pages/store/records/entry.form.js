import { MinusCircleOutlined, PaperClipOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Descriptions, Form, Input, Space, Table, Tooltip } from "antd"
import _ from "lodash"
import { RefCascader } from "../../../components"
import { buildProductTree, toFixedWithoutTrailingZero as fixed } from "../../../utils"
import React, { useContext } from 'react';
import { SettingContext } from "."
import heraApi from "../../../api"

const styles = {
  block: { width: '100%' }
}
const rules = [{ required: true }]

const UnitLabel = ({ field }) => {
  const form = Form.useFormInstance()
  const product = Form.useWatch(['entries', field.name, 'product'], form)
  const result = heraApi.useGetProductListQuery()
  if (result.isError || result.isLoading || _.isEmpty(product)) {
    return ''
  }
  const fetchResult = _.filter(result.data, item => item.type === product[0] && item.name === product[1] && item.size === product[2])
  if (fetchResult.length > 0) {
    return fetchResult[0].isScaled ? fetchResult[0].unit : fetchResult[0].countUnit
  } else {
    return ''
  }
}

const TotalLabel = ({ field }) => {
  const form = Form.useFormInstance()
  const product = Form.useWatch(['entries', field.name, 'product'], form)
  const count = Form.useWatch(['entries', field.name, 'count'], form)
  const result = heraApi.useGetProductListQuery()
  if (result.isError || result.isLoading || _.isEmpty(product) || _.isNaN(count) || _.isUndefined(count)) {
    return ''
  }
  const fetchResult = _.filter(result.data, item => item.type === product[0] && item.name === product[1] && item.size === product[2])
  if (fetchResult.length > 0) {
    return fixed(fetchResult[0].isScaled ? fetchResult[0].scale * count : count)
  } else {
    return ''
  }
}

const WeightLabel = ({ field }) => {
  const form = Form.useFormInstance()
  const product = Form.useWatch(['entries', field.name, 'product'], form)
  const count = Form.useWatch(['entries', field.name, 'count'], form)
  const result = heraApi.useGetProductListQuery()
  if (result.isError || result.isLoading || _.isEmpty(product) || _.isNaN(count) || _.isUndefined(count)) {
    return ''
  }
  const fetchResult = _.filter(result.data, item => item.type === product[0] && item.name === product[1] && item.size === product[2])
  if (fetchResult.length > 0) {
    return fixed(fetchResult[0].weight * count / 1000) + 't'
  } else {
    return ''
  }
}

const Summary = () => {
  const form = Form.useFormInstance()
  const entries = Form.useWatch('entries', form)
  const result = heraApi.useGetProductListQuery()
  if (_.isUndefined(entries)) {
    return ''
  }
  // 排除空值
  const validEntries = _.filter(entries, entry => !_.isUndefined(entry) && !_.isEmpty(entry.product) && !_.isUndefined(entry.count) && !_.isEmpty(entry.count))
  if (result.isError || result.isLoading || validEntries.length === 0) {
    return ''
  }
  // 关联数据
  const equippedEntries = validEntries.map(entry => ({
    ...result.data.find(item =>
      item.type === entry.product[0] &&
      item.name === entry.product[1] &&
      item.size === entry.product[2]
    ),
    ...entry
  })).filter(item => !_.isUndefined(item.weight))
  // 计算结果
  const calculatedEntries = equippedEntries.map(item => ({
    ...item,
    total: item.isScaled ? item.count * item.scale : item.count,
    weight: item.count * item.weight / 1000,
  }))
  // reduce
  const resultEntries = _.reduce(calculatedEntries, (result, item) => {
    if (_.isUndefined(result[`${item.type}|${item.name}`])) {
      result[`${item.type}|${item.name}`] = {
        count: 0,
        unit: item.isScaled ? item.unit : item.countUnit,
      }
    }
    result[`${item.type}|${item.name}`].count += item.total
    result['理论重量'].count += item.weight
    return result
  }, { 理论重量: { count: 0, unit: '吨' } })
  const items = _.map(resultEntries, (v, k)=> (
    <Descriptions.Item key={k} label={k}>{fixed(v.count)}{v.unit}</Descriptions.Item>
  ))
  return (
    <Descriptions title='小结'>
      {items}
    </Descriptions>
  )
}

export default ({ fields, operation, meta }) => {
  const form = Form.useFormInstance()
  const settings = useContext(SettingContext)
  const columns = []
  columns.push({
    key: 'product',
    title: '产品',
    width: 300,
    render: (_, field) => (
      <RefCascader
        noStyle
        item={{ required: true, name: [field.name, 'product'], option: { ref: 'product' } }}
        customBuild={data => buildProductTree(data).children}
      />
    )
  })
  columns.push({
    key: 'count',
    title: '数量',
    width: 100,
    render: (_, field) => (
      <Form.Item name={[field.name, 'count']} rules={rules}>
        <Input style={styles.block} />
      </Form.Item>
    )
  })
  columns.push({
    key: 'total',
    title: '小计',
    width: 44,
    align: 'center',
    render: (_, field) => (
      <TotalLabel field={field} />
    )
  })
  columns.push({
    key: 'unit',
    title: '单位',
    width: 44,
    align: 'center',
    render: (_, field) => (
      <UnitLabel field={field} />
    )
  })
  columns.push({
    key: 'weight',
    title: '重量',
    width: 44,
    align: 'center',
    render: (_, field) => (
      <WeightLabel field={field} />
    )
  })
  if (settings.price) {
    columns.push({
      key: 'price',
      title: '单价',
      width: 100,
      render: (_, field) => (
        <Form.Item name={[field.name, 'price']} rules={rules}>
          <Input style={styles.block} />
        </Form.Item>
      )
    })
  }
  columns.push({
    key: 'comments',
    title: '备注',
    render: (_, field) => (
      <Form.Item name={[field.name, 'comments']}>
        <Input style={styles.block} />
      </Form.Item>
    )
  })
  columns.push({
    key: 'action',
    title: '操作',
    width: 88,
    render: (_text, field, i) => <Space>
      <Button icon={<MinusCircleOutlined />} type='text' onClick={() => operation.remove(field.name)}></Button>
      <Tooltip title='新增关联'><Button icon={<PaperClipOutlined />} type='text' onClick={() => {
        const product = form.getFieldValue('entries')[i].product
        if (_.isEmpty(product)) return;
        const complement = { level: 'associated', associate: JSON.stringify(product), direction: '出' }
        if (typeof form.getFieldValue('complements') === 'undefined') {
          form.setFieldValue('complements', [complement])
        } else {
          form.setFieldValue('complements', form.getFieldValue('complements').concat(complement))
        }
      }}></Button></Tooltip>
    </Space>
  })
  return <>
    <Table columns={columns} dataSource={fields} pagination={false} size='small' footer={Summary} />
    <Button type="dashed" block onClick={() => operation.add()} icon={<PlusCircleOutlined />}>增加</Button>
  </>
}