import React, { useState } from 'react'
import { push } from 'react-router-redux'
import { message, Card, Form, Input, Select, Button } from 'antd'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import styles from './Login.module.css'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

const Login = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const onSubmit = async ({ company, username, password })=> {
    try {
      const res = await axios.post('/api/login', {
        company, username, password
      })
      localStorage.setItem('X-Hera-Token', res.data.access_token)
      dispatch(push('/dashboard'))
    } catch {
      message.error('登录失败，请检查账号或者密码是否有问题！');
      form.getFieldInstance('username').focus()
    }
  }

  return (
    <main>
      <Card title="赫拉管理系统" className={styles.login}>
        <Form onFinish={onSubmit} form={form}>
          <Form.Item name="company" id="company">
            <Select placeholder="公司" defaultValue="上海创兴建筑设备租赁有限公司">
              <Select.Option>上海创兴建筑设备租赁有限公司</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="username" id="username">
            <Input prefix={<UserOutlined />} placeholder="操作员" autoFocus allowClear />
          </Form.Item>
          <Form.Item name="password" id="password">
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit">登录</Button>
          </Form.Item>
        </Form>
      </Card>
    </main>
  )
}

export default Login