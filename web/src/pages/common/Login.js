import React, { useEffect } from 'react'
import { useNavigate } from 'utils/hooks'
import { Avatar, Button, Card, Form, Input, message, Select } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import heraApi from '../../api'

export default () => {
  const navigate = useNavigate()
  const [login, loginResult] = heraApi.useLoginMutation()
  useEffect(() => {
    if (loginResult.isSuccess) {
      message.success('登录成功！');
      localStorage.setItem('X-Hera-Token', loginResult.data)
      navigate('/dashboard')
    }
    if (loginResult.isError) {
      message.error('登录失败，请检查账号或者密码是否有问题！');
    }
  }, [navigate, loginResult])
  return (
    <main style={{ width: '100%', height: '100%' }}>
      <Card
        style={{ width: '400px', margin: '64px auto' }}
        title={<><Avatar size='large' style={{ backgroundColor: '#f50057' }} icon={<LockOutlined />} /><br /><h3 style={{ fontWeight: '400', fontSize: '1.5rem' }}>赫拉管理系统</h3></>}
        headStyle={{ textAlign: 'center' }}>
        <Form layout='vertical' onFinish={login} initialValues={{ company: '上海创兴建筑设备租赁有限公司' }}>
          <Form.Item name='company' label='公司' required>
            <Select>
              <Select.Option key='上海创兴建筑设备租赁有限公司'>上海创兴建筑设备租赁有限公司</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name='username' label='操作员' required>
            <Input />
          </Form.Item>
          <Form.Item name='password' label='密码' required>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block>登录</Button>
          </Form.Item>
        </Form>
      </Card>
    </main>
  )
}