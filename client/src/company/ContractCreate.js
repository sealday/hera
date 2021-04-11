import React from 'react'

import moment from 'moment'
import { connect } from 'react-redux'
import {
  Button,
  Card,
  Form,
  Input,
  PageHeader,
  DatePicker,
  Select,
} from 'antd'
import { antFilterOption } from '../components'


import { Link } from 'react-router'
import 'antd/lib/card/style/css'
import 'antd/lib/page-header/style/css'
import 'antd/lib/table/style/css'
import 'antd/lib/space/style/css'
import 'antd/lib/tag/style/css'
import 'antd/lib/row/style/css'
import 'antd/lib/col/style/css'
import 'antd/lib/descriptions/style/css'
import 'antd/lib/form/style/css'
import 'antd/lib/input/style/css'
import { newErrorNotify, newInfoNotify, newSuccessNotify } from '../actions'
import { push } from 'react-router-redux'
import { ajax } from '../utils'

const mapStateToProps = state => ({
  projects: state.system.projects,
})

export default connect(mapStateToProps)(({ router, projects, dispatch }) => {
  const [form] = Form.useForm()

  return <>
    <PageHeader
      ghost={false}
      title="创建合同"
      extra={[
        <Button key={1} onClick={() => router.goBack()}>返回</Button>,
        <Button type="primary" onClick={() => {
          form.submit()
        }}>保存</Button>,
      ]}
    >
    </PageHeader>
    <Card title="基础信息" style={{ marginTop: '8px' }}>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        name="合同基础信息"
        form={form}
        onFinish={v => {
          dispatch(newInfoNotify('提示', '正在创建', 1000))
          ajax('/api/contract', {
            data: JSON.stringify(v),
            method: 'POST',
            contentType: 'application/json'
          }).then(() => {
            dispatch(newSuccessNotify('提示', '创建成功', 1000))
            dispatch(push(`/contract`))
          }).catch(() => {
            dispatch(newErrorNotify('警告', '创建失败', 1000))
          })
        }}
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
  </>
})