import _ from 'lodash'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'utils/hooks'

import { PageHeader } from '../../../components'
import { useCreatePlanMutation } from '../../../api'
import PlanForm from './PlanForm'

const PlanCreate = () => {
  const [createPlan, createResult] = useCreatePlanMutation()
  const navigate = useNavigate()
  const onSubmit = v => {
    createPlan(v)
  }
  useEffect(() => {
    if (createResult.isSuccess) {
      navigate(-1)
    }
  }, [navigate, createResult.isSuccess])
  const initialValues = { type: 'price' }
  const form = useRef()
  return (
    <PageHeader
      title="新增计算方案"
      onSave={() => form.current.submit()}
    >
      <PlanForm initialValues={initialValues} onSubmit={onSubmit} form={form} />
    </PageHeader>
  )
}
export default PlanCreate