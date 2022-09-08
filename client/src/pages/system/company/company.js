import { useState, useRef, useEffect } from 'react'
import {Table, Spin, Modal, Form, Row, Col, Input, Radio, Select, message, Space, Button} from 'antd'
import { PageHeader } from '../../../components'
import { useGetCompanyListQuery, useCreateCompanyMutation, useDeleteCompanyMutation } from '../../../api'
const Company = () => {
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '纳税人类别',
      dataIndex: 'tc',
      key: 'tc',
    },
    {
      title: '纳税人识别号',
      dataIndex: 'tin',
      key: 'tin',
    },
    {
      title: '地址',
      dataIndex: 'addr',
      key: 'addr',
    },
    {
      title: '电话',
      dataIndex: 'tel',
      key: 'tel',
    },
    {
      title: '开户行',
      dataIndex: 'bank',
      key: 'bank',
    },
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '行号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
  ]
  const { data, error, isLoading } = useGetCompanyListQuery()
  const [createCompany, createResult] = useCreateCompanyMutation()
  const [deleteCompany, deleteResult] = useDeleteCompanyMutation()
  columns.push({
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render(_, record) {
      return <Space>
        <Button type='text' danger onClick={() => deleteCompany(record._id)}>删除</Button>
      </Space>
    }
  })
  const ref = useRef()
  if (error) {
    return <div>Some Errors.</div>
  }
  if (isLoading && !data) {
    return <Spin />
  }
  return <div>
    <FormModal modal={ref} title='公司信息录入' InnerForm={CompanyForm} onFinish={v => createCompany(v)} />
    <PageHeader
      title='公司信息'
      subTitle='这里编辑所有的公司信息'
      onCreate={() => { if (ref && ref.current) { ref.current.open() } }}
    >
      <Table columns={columns} dataSource={data} rowKey='name' />
    </PageHeader>
  </div>
}

const CompanyForm = ({ ...props }) => (
    <Form layout='horizontal' {...props}>
      <Row>
        <Col span={12}>
          <Form.Item required label='名称' name='name' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} rules={[{ required: true }]} >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item required label='角色' name='role' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value='分公司'>分公司</Radio>
              <Radio value='客户公司'>客户公司</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item required label='纳税人识别号' name='tin' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item required label='纳税人类别' name='tc' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Radio.Group>
              <Radio value='一般纳税人'>一般纳税人</Radio>
              <Radio value='小规模纳税人'>小规模纳税人</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item required label='地址' name='addr' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
        <Input />
      </Form.Item>
      <Form.Item required label='电话' name='tel' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
        <Input />
      </Form.Item>
      <Form.Item required label='开户行' name='bank' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
        <Input />
      </Form.Item>
      <Form.Item required label='账号' name='account' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
        <Input />
      </Form.Item>
      <Form.Item label='行号' name='code' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
        <Input />
      </Form.Item>
    </Form>
)

const FormModal = ({ title, modal, InnerForm, onFinish}) => {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  if (modal) {
    modal.current = {
      open() {
        setVisible(true)
      },
      close() {
        setVisible(false)
      }
    }
  }
  return <Modal
      width={800}
      title={title}
      visible={visible}
      onCancel={() => {
        setVisible(false)
      }}
      onOk={() => {
        form.submit()
      }}
  >
    <InnerForm form={form} onFinish={v => {onFinish(v); setVisible(false) }} />
  </Modal>
}

export default Company