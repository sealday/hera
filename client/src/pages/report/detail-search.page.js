import { Form } from "antd"
import { PageHeader } from "../../components"
import { detailSearchFormSchema } from "../../schema"
import { genFormContent } from "../../utils/antd"

export default () => {

  const [form] = Form.useForm()
  const initialValues = {}
  const formItems = genFormContent(detailSearchFormSchema, 3, form, initialValues)

  return (
    <PageHeader
      title='明细查询'
    >
      <Form colon={false} form={form} initialValues={initialValues}>
        {formItems}
      </Form>
    </PageHeader>
  )
}