import { Card, Form } from "antd"
import { employeeSchema } from "../../schema"
import { genFormContent } from "../../utils/antd"

export default ({ form: formRef, initialValues, onSubmit }) => {
  const [form] = Form.useForm()
  if (formRef && !formRef.current) {
    formRef.current = form
  }
  return (
    <Card bordered={false}>
      <Form colon={false} labelCol={{ flex: '100px' }} initialValues={initialValues} form={form} onFinish={onSubmit}>
        {genFormContent(employeeSchema)}
      </Form>
    </Card>
  )
}