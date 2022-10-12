import { SaveOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Row } from "antd"
import { PageHeader } from "../../../components"
import { voucherSchema } from "../../../schema"
import { genFormContent } from "../../../utils/antd"

export default () => {
  const [form] = Form.useForm()
  const formContent = genFormContent(voucherSchema, 3)
  return (
    <PageHeader title='凭证录入'>
      <Card>
        <Form form={form} colon={false} onFinish={v => console.log(v)}>
          {formContent}
          <Form.Item>
            <Button 
              style={{ marginTop: '8px' }}
              block type='primary' htmlType='submit' icon={<SaveOutlined />}>保存</Button>
          </Form.Item>
        </Form>
      </Card>
    </PageHeader>
  )
}