import _ from 'lodash'
import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Error, Loading, PageHeader } from '../../../components'
import { useCreatePlanMutation, useGetPlanQuery } from '../../../api'
import PlanForm from './PlanForm'

export default () => {
  const [createPlan, createResult] = useCreatePlanMutation()
  const { id: planId } = useParams()
  const getPlanQuery = useGetPlanQuery(planId)
  const navigate = useNavigate()
  useEffect(() => {
    if (createResult.isSuccess) {
      navigate(-1)
    }
  }, [createResult.isSuccess])
  const form = useRef()
  if (getPlanQuery.isError) {
    return  <Error />
  }
  if (getPlanQuery.isLoading) {
    return <Loading />
  }
  const onSubmit = v => {
    createPlan(v)
  }
  const initialValues = { ...getPlanQuery.data }
  initialValues.entries = getPlanQuery.data.entries.map(item => ({ ...item, product: [item.type, item.name, item.size] }))
  return (
    <PageHeader
      title="编辑计算方案"
      onSave={() => form.current.submit()}
    >
      <PlanForm initialValues={initialValues} onSubmit={onSubmit} form={form} />
    </PageHeader>
  )
}