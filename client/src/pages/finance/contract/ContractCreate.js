import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Card,
  Form,
  Input,
  DatePicker,
  Select,
} from 'antd'
import { antFilterOption, PageHeader } from '../../../components'
import { useNavigate } from 'react-router-dom'
import heraApi from '../../../api'

export default ({ dispatch }) => {
  const projects = useSelector(state => state.system.projects)
  const [form] = Form.useForm()
  const [createContract, createResult] = heraApi.useCreateContractMutation()
  const navigate = useNavigate()
  useEffect(() => {
    if (createResult.isSuccess) {
      navigate('/contract')
    }
  }, [navigate, createResult.isSuccess])

  return (
    <PageHeader
      title="创建合同"
      onSave={() => { form.submit() }}
    >
      <Card title="基础信息" style={{ marginTop: '8px' }}>
        <Form
          colon={false}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          name="合同基础信息"
          form={form}
          onFinish={v => createContract(v)}
        >
          <Form.Item
            label="合同名称"
            name="name"
            rules={[{ required: true, message: '此处为必填项！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="合同编号"
            name="code"
            rules={[{ required: true, message: '此处为必填项！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="项目部"
            name="project"
            rules={[{ required: true, message: '此处为必填项！' }]}
          >
            <Select
              showSearch
              filterOption={antFilterOption}
            >
              {projects.map(p => <Select.Option
                key={p._id}
                value={p._id}
                pinyin={p.pinyin}
              >
                {p.completeName}
              </Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            label="地址"
            name="address"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="日期"
            name="date"
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="备注"
            name="comments"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Card>
    </PageHeader>
  )
}