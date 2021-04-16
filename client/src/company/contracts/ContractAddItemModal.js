import React, { useState } from 'react'

import {
  Modal,
  Form,
  Select,
  DatePicker,
} from 'antd'
import { useForm } from 'antd/lib/form/Form'
import moment from 'moment'
import DateModifier from '../DateModifier'

export default ({ initialValues, onFinish, plans, visible, onClose }) => {
  const [form] = useForm()
  const [category, setCategory] = useState(initialValues['category'])
  return <Modal
    title="合同规则明细"
    visible={visible}
    onOk={() => form.submit()}
    onCancel={() => onClose()}>
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      name="合同规则明细"
      form={form}
      initialValues={initialValues}
      onValuesChange={e => {
        if (e['category']) {
          setCategory(e['category'])
          form.resetFields(['plan'])
        }
      }}
      onFinish={v => {
        onFinish(v)
        onClose()
      }}
    >
      <Form.Item
        label="方案分类"
        name="category"
        rules={[{ required: true, message: '此处为必填项！' }]}
      >
        <Select>
          <Select.Option key={1} value="price">租金方案</Select.Option>
          <Select.Option key={2} value="weight">计重方案</Select.Option>
          <Select.Option key={3} value="loss">赔偿方案</Select.Option>
          <Select.Option key={4} value="service">维修方案</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="方案"
        name="plan"
        rules={[{ required: true, message: '此处为必填项！' }]}
      >
        <Select>
          {
            plans && plans[category] && plans[category]
              .map(plan => <Select.Option key={plan._id} value={plan._id}>{plan.name}</Select.Option>)
          }
        </Select>
      </Form.Item>
      <Form.Item
        label="时间区间"
        name="date"
        rules={[{ required: true, message: '此处为必填项！' }]}
      >
        <DatePicker.RangePicker
          renderExtraFooter={
            () => <DateModifier
              setDate={date => form.setFieldsValue({ date })}
              date={form.getFieldValue('date') ? form.getFieldValue('date')[0] : moment()}
            />
          }
        />
      </Form.Item>
    </Form>
  </Modal>
}