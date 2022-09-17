import { Form } from "antd"
import moment from "moment"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import heraApi from "../../../api"
import { PageHeader } from "../../../components"
import { array2product } from "../../../utils"
import RuleForm from "./rule.form"

const styles = {
  keepSpace: { marginTop: '8px' },
  block: { width: '100%' },
}
export default () => {
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const [createRule, createResult] = heraApi.useCreateRuleMutation()
  const navigate = useNavigate()
  useEffect(() => {
    if (createResult.isSuccess) {
      navigate(-1)
    }
  }, [navigate, createResult.isSuccess])
  const initialValues = {
    date: moment(),
  }
  const handleSubmit = (v) => {
    if (category === '租金') {
      const rule = {
        category,
        ...v,
        items: v.items.map(item => ({
          ...item,
          product: array2product(item.product, item.level === '规格')
        }))
      }
      createRule(rule)
    } else if (category === '计重') {
      const rule = {
        category,
        ...v,
        items: v.items.map(item => ({
          ...item,
          product: array2product(item.product)
        }))
      }
      createRule(rule)
    } else if (category === '非租') {
      const rule = {
        category,
        ...v,
        items: v.items.map(item => ({
          ...item,
          associate: item.level === '按单' ? undefined : array2product(item.associate, item.level === '规格'),
          product: array2product(item.product),
        }))
      }
      createRule(rule)
    }
  }
  return (
    <PageHeader
      title='合同计算规则'
      subTitle={`正在录入${category}规则`}
      onSave={() => { form.submit() }}
    >
      <RuleForm initialValues={initialValues} form={form} category={category} onSubmit={handleSubmit} />
    </PageHeader>
  )
}