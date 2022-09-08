import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import heraApi from "../../api"
import { Error, Loading, PageHeader } from "../../components"
import EmployeeForm from "./employee.form"

export default () => {
  const form = useRef()
  const navigate = useNavigate()
  const { id } = useParams()
  const getEmployeeQuery = heraApi.useGetEmployeeQuery(id)
  const [createEmployee, createResult] = heraApi.useCreateEmployeeMutation()
  useEffect(() => {
    if (createResult.isSuccess) {
      navigate(-1)
    }
  }, [createResult.isSuccess])
  if (getEmployeeQuery.isError) {
    return <Error />
  }
  if (getEmployeeQuery.isLoading) {
    return <Loading />
  }
  return (
    <PageHeader
      title='新增员工'
      onSave={() => form.current.submit()}
    >
      <EmployeeForm form={form} onSubmit={v => createEmployee(v)} initialValues={getEmployeeQuery.data} />
    </PageHeader>
  )
}