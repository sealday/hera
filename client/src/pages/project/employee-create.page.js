import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import heraApi from "../../api"
import { PageHeader } from "../../components"
import EmployeeForm from "./employee.form"

export default () => {
  const form = useRef()
  const navigate = useNavigate()
  const [createEmployee, createResult] = heraApi.useCreateEmployeeMutation()
  useEffect(() => {
    if (createResult.isSuccess) {
      navigate(-1)
    }
  }, [createResult.isSuccess])
  return (
    <PageHeader
      title='新增员工'
      onSave={() => form.current.submit()}
    >
      <EmployeeForm form={form} onSubmit={v => createEmployee(v)} />
    </PageHeader>
  )
}