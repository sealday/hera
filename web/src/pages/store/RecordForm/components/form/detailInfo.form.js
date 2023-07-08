import React from 'react'
import {
  Radio,
  Tag,
  Button,
  Form,
  Input,
  InputNumber,
  Table,
  Space,
} from 'antd'
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons'

import EntryForm from './entry.form'
import { styles } from '../../utils/constants'
import { getRandomColor } from '../../utils/color'
import { Summary } from './entry.form'

const colors = []

const DetailInfoForm = ({ fields, operation }) => {
  colors.push(getRandomColor())
  const columns = [
    {
      key: 'productGroups',
      title: '产品分组',
      width: 250,
      align: 'center',
      render: (_, field) => (
        <Tag color={colors[field.key]}>{`分组${field.name + 1}`}</Tag>
      ),
    },
    {
      key: 'realWeight',
      title: '过磅重量',
      align: 'center',
      width: 250,
      render: (_, field) => (
        <Form.Item name={[field.name, 'realWeight']}>
          <InputNumber min={0} max={10000} style={styles.block} />
        </Form.Item>
      ),
    },
    {
      key: 'unit',
      title: '单位',
      align: 'center',
      render: (_, field, index) => (
        <Form.Item name={[field.name, 'unit']} initialValue={'吨'}>
          <Radio.Group key={field?.name || index} options={['千克', '吨']} />
        </Form.Item>
      ),
    },

    {
      key: 'comments',
      title: '备注',
      width: 250,
      render: (_, field) => (
        <Form.Item name={[field.name, 'comments']}>
          <Input style={styles.block} />
        </Form.Item>
      ),
    },
    {
      key: 'action',
      width: 88,
      render: (_text, field) => (
        <Space>
          <Button
            type="link"
            onClick={() => operation.remove(field.name)}
            danger
          >
            删除当前分组
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={fields}
      pagination={false}
      size="small"
      expandable={{
        expandedRowRender: (record, index) => (
          <Form.List name={[record.name, 'entries']}>
            {(formFields, formOperation) => (
              <EntryForm
                fields={formFields}
                operation={formOperation}
                groupsIndex={index}
              />
            )}
          </Form.List>
        ),
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <MinusCircleTwoTone onClick={e => onExpand(record, e)} />
          ) : (
            <PlusCircleTwoTone onClick={e => onExpand(record, e)} />
          ),
      }}
      footer={Summary}
    />
  )
}


export default DetailInfoForm
