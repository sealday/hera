import { Button, Col, Form, Popover, Row, Space } from "antd"
import { useState } from "react"
import { generateFormContent } from "../utils"

export default ({ block = false, type = 'link', children, schema, onSubmit, initialValues, size = 'middle' }) => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const hide = () => {
    setOpen(false);
  }

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  }
  const content = (
    <Form form={form} onFinish={(v) => { onSubmit(v); hide() }} initialValues={initialValues}>
      {generateFormContent(schema)}
      <Form.Item>
        <Row gutter={24}>
          <Col span={12}>
            <Button block type='default' onClick={() => hide()}>取消</Button>
          </Col>
          <Col span={12}>
            <Button block type='primary' htmlType='submit'>保存</Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  )

  return (
    <Popover
      placement='top'
      trigger='click'
      open={open}
      handleOpenChange={handleOpenChange}
      content={content}>
      <Button size={size} type={type} onClick={() => setOpen(true)} block={block}>{children}</Button>
    </Popover>
  )
}