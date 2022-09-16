import { Form } from "antd"
import moment from "moment"
import { useParams } from "react-router-dom"
import heraApi from "../../../api"
import { Error, Loading, PageHeader } from "../../../components"
import RuleForm from "./rule.form"

export default () => {
  const { id } = useParams()
  const getRule = heraApi.useGetRuleQuery(id)
  const [form] = Form.useForm()
  if (getRule.isError) {
    return <Error />
  }
  if (getRule.isLoading) {
    return <Loading />
  }

  const handleSubmit = () => {

  }

  const initialValues = {
    ...getRule.data,
    date: moment(getRule.data.date),
    items: getRule.data.items.map(item => ({
      ...item,
      product: item.level === '规格' || getRule.data.category === '计重' || getRule.data.category === '非租'
        ? [item.product.type, item.product.name, item.product.size]
        : [item.product.type, item.product.name],
    }))
  }

  return (
    <PageHeader
      title='合同计算规则'
      subTitle='正在编辑'
      onSave={() => form.submit()}
    >
      <RuleForm onSubmit={handleSubmit} form={form} initialValues={initialValues} />
    </PageHeader>
  )
}