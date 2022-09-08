import { Card, Form } from "antd"
import { employeeSchema } from "../../schema"
import { generateFormContent } from "../../utils"

export default ({ form: formRef, initialValues, onSubmit }) => {
  const [form] = Form.useForm()
  if (formRef && !formRef.current) {
    formRef.current = form
  }
  return (
    <Card bordered={false}>
      <Form colon={false} labelCol={{ flex: '100px' }} initialValues={initialValues} form={form} onFinish={onSubmit}>
        {generateFormContent(employeeSchema)}
      </Form>
    </Card>
  )
}