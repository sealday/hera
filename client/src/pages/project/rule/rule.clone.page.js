import { Form } from "antd"
import moment from "moment"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import heraApi from "../../../api"
import { Error, Loading, PageHeader } from "../../../components"
import { array2product, product2array } from "../../../utils"
import RuleForm from "./rule.form"

export default () => {
  const { id } = useParams()
  const getRule = heraApi.useGetRuleQuery(id)
  const [createRule, createResult] = heraApi.useCreateRuleMutation()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  useEffect(() => {
    if (createResult.isSuccess) {
      navigate(-1)
    }
  }, [navigate, createResult.isSuccess])
  if (getRule.isError) {
    return <Error />
  }
  if (getRule.isLoading) {
    return <Loading />
  }

  const category = getRule.data.category
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
        }))
      }
      createRule(rule)
    }
  }

  const rule = getRule.data
  const initialValues = {
    ...rule,
    name: rule.name + '（克隆）',
    date: moment(rule.date),
    items: rule.items.map(item => ({
      ...item,
      product: rule.category !== '非租' ? product2array(item.product, item.level === '规格' || rule.category === '计重' || rule.category === '非租') : undefined,
      associate: rule.category !== '非租' || item.level === '按单'
        ? undefined
        : product2array(item.associate, item.level === '规格')
    }))
  }

  return (
    <PageHeader
      title='合同计算规则'
      subTitle={`正在录入${category}规则`}
      onSave={() => form.submit()}
    >
      <RuleForm onSubmit={handleSubmit} form={form} initialValues={initialValues} category={rule.category} />
    </PageHeader>
  )
}