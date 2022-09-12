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
  const [updateEmployee, updateResult] = heraApi.useUpdateEmployeeMutation()
  useEffect(() => {
    if (updateResult.isSuccess) {
      navigate(-1)
    }
  }, [navigate, updateResult.isSuccess])
  if (getEmployeeQuery.isError) {
    return <Error />
  }
  if (getEmployeeQuery.isLoading) {
    return <Loading />
  }
  return (
    <PageHeader
      title='编辑员工'
      onSave={() => form.current.submit()}
    >
      <EmployeeForm form={form} onSubmit={v => updateEmployee({ id, employee: v })} initialValues={getEmployeeQuery.data} />
    </PageHeader>
  )
}