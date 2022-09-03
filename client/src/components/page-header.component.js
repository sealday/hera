import { useState } from 'react'
import { Button, Card, Col, Form, PageHeader, Row, Space, Input, Descriptions } from 'antd'
import { PlusCircleOutlined, EditOutlined, PrinterOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

export default ({ title, subTitle, onCreate, onEdit, children, onPrintPreview, onPrint, searchInfo, onSearch, description, extra }) => {
  const [filterValues, setFilterValues] = useState({})
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const recentItems = []
  const actions = []
  const canGoBack = () => {
    return window.history.length > 1
  }
  if (canGoBack()) {
    actions.push(<Button key='goBack' type='default' onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>返回</Button>)
  }
  if (extra) {
    actions.push(...extra)
  }
  if (onPrintPreview) {
    actions.push(<Button key='onCreate' type='default' onClick={onPrintPreview} icon={<PrinterOutlined />}>打印预览</Button>)
  }
  if (onCreate) {
    actions.push(<Button key='onCreate' type='primary' onClick={onCreate} icon={<PlusCircleOutlined />}>创建</Button>)
  }
  if (onEdit) {
    actions.push(<Button key='onEdit' type='primary' onClick={onEdit} icon={<EditOutlined />}>编辑</Button>)
  }
  if (onPrint) {
    actions.push(<Button key='onCreate' type='primary' onClick={onPrint} icon={<PrinterOutlined />}>打印</Button>)
  }
  return <>
    <PageHeader
      title={title}
      subTitle={subTitle}
      ghost={false}
      extra={<Space>{actions}</Space>}
    >
      {description ?
        <Descriptions>
          <Descriptions.Item label='出库项目'>abc</Descriptions.Item>
          <Descriptions.Item label='入库项目'>abc</Descriptions.Item>
        </Descriptions>
        : <></>}
    </PageHeader>
    {searchInfo ?
      <Card bordered={false}>
        <Form
          onFinish={values => setFilterValues(values)}
          onReset={() => setFilterValues({})}
          form={form}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="名称"
                name="name"
              >
                <Input autoComplete='off' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Space size="middle">
                <Button type='primary' htmlType='submit'>查询</Button>
                <Button htmlType='reset'>重置</Button>
              </Space>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Space>
                <span>最近搜索过：</span>
                {recentItems.map(item => (
                  <Button type='dashed' key={item}
                    onClick={() => {
                      form.setFieldsValue({ name: item })
                      form.submit()
                    }}
                  >{item}</Button>
                ))}
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
      : <></>}
    {children ?
      <div style={{ marginTop: '8px' }}>
        {children}
      </div>
      : <></>}
  </>
}