import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { Button, Form, Input, Radio, Select, Space, Table, Tooltip } from 'antd'
import _ from 'lodash'
import { RefCascader } from '../../../components'
import React from 'react'
import heraApi from '../../../api'

const styles = {
  block: { width: '100%' },
}
const rules = [{ required: true }]

const UnitLabel = ({ field }) => {
  const form = Form.useFormInstance()
  const level = Form.useWatch(['complements', field.name, 'level'], form)
  const associateStr = Form.useWatch(
    ['complements', field.name, 'associate'],
    form
  )
  const product = Form.useWatch(['complements', field.name, 'product'], form)
  const getProductList = heraApi.useGetProductListQuery()
  const getOtherList = heraApi.useGetOtherListQuery()
  if (
    getProductList.isError ||
    getProductList.isLoading ||
    getOtherList.isError ||
    getOtherList.isLoading
  ) {
    return ''
  }
  if (level === 'unconnected') {
    const other = _.find(getOtherList.data, item => item.id === _.last(product))
    return _.get(other, 'unit', '')
  } else if (level === 'associated') {
    const other = _.find(getOtherList.data, item => item.id === _.last(product))
    const isAssociated = _.get(other, 'isAssociated', false)
    if (isAssociated) {
      const associate = JSON.parse(associateStr)
      const associatedProduct = _.find(
        getProductList.data,
        item =>
          item.type === associate[0] &&
          item.name === associate[1] &&
          item.size === associate[2]
      )
      return _.get(associatedProduct, 'isScaled')
        ? _.get(associatedProduct, 'unit', '')
        : _.get(associatedProduct, 'countUnit', '')
    } else {
      return _.get(other, 'unit', '')
    }
  } else {
    return ''
  }
}

const ComplementForm = ({ fields, operation, meta }) => {
  const form = Form.useFormInstance()
  const entries = Form.useWatch(['entries'])
  const associateOptions = _.chain(entries)
    .filter(entry => !_.isEmpty(entry) && !_.isEmpty(entry.product))
    .map(entry => ({
      label: entry.product.join(' / '),
      value: JSON.stringify(entry.product),
    }))
    .value()
  const columns = [
    {
      key: 'direction',
      title: (
        <>
          出入库&nbsp;
          <Tooltip title="同表示随当前出入库单，无表示无关出入库，反表示与当前出入库相反">
            <QuestionCircleOutlined />
          </Tooltip>
        </>
      ),
      width: 120,
      align: 'center',
      render: (_, field) => (
        <Form.Item name={[field.name, 'direction']}>
          <Radio.Group
            buttonStyle="solid"
            optionType="button"
            size="small"
            options={[
              { label: '同', value: '同' },
              { label: '无', value: '无' },
              { label: '反', value: '反' },
            ]}
          />
        </Form.Item>
      ),
    },
    {
      key: 'associate',
      title: '关联',
      width: 300,
      render: (_, field) => (
        <Form.Item name={[field.name, 'associate']} rules={rules}>
          <Select options={associateOptions} style={styles.block} />
        </Form.Item>
      ),
    },

    {
      key: 'product',
      title: '项目',
      width: 180,
      render: (_, field) => (
        <RefCascader
          item={{
            name: [field.name, 'product'],
            option: { ref: 'other', label: 'name', value: 'id' },
          }}
          rules={rules}
        />
      ),
    },
    {
      key: 'count',
      title: '数量',
      width: 100,
      render: (_, field) => (
        <Form.Item name={[field.name, 'count']} rules={rules}>
          <Input style={styles.block} />
        </Form.Item>
      ),
    },
    {
      key: 'unit',
      title: '单位',
      width: 44,
      align: 'center',
      render: (_, field) => <UnitLabel field={field} />,
    },
    {
      key: 'comments',
      title: '备注',
      render: (_, field) => (
        <Form.Item name={[field.name, 'comments']}>
          <Input style={styles.block} />
        </Form.Item>
      ),
    },
    {
      key: 'action',
      title: '操作',
      width: 88,
      render: (_, field, i) => (
        <Space>
          <Button
            icon={<MinusCircleOutlined />}
            type="text"
            onClick={() => operation.remove(field.name)}
          ></Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={fields}
        size="small"
        pagination={false}
      />
      <Button
        type="dashed"
        block
        onClick={() => operation.add({ level: 'associated', direction: '无' })}
        icon={<PlusCircleOutlined />}
      >
        增加
      </Button>
    </>
  )
}

export default ComplementForm
