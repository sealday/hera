import { Space, Button } from 'antd'
import { Error, Loading, ModalFormButton, PageHeader, ResultTable } from '../../../components'
import { useCreateCompanyMutation, useDeleteCompanyMutation, useGetCompanyListQuery, useUpdateCompanyMutation } from '../../../api'
import { companySchema } from '../../../schema'
import { genTableColumn } from '../../../utils'

export default () => {
  const { data, error, isloading } = useGetCompanyListQuery()
  const [createCompany] = useCreateCompanyMutation()
  const [updateCompany] = useUpdateCompanyMutation()
  const [deleteCompany] = useDeleteCompanyMutation()
  const columns = genTableColumn(companySchema)
  console.log(companySchema)
  console.log(columns)
  columns.push({
    title: '操作',
    key: 'action',
    render(_, record) {
      return <Space>
        <ModalFormButton
          onSubmit={v => updateCompany({ id: record._id, company: v })}
          title='编辑公司信息' type='link' schema={companySchema} initialValues={record}>编辑</ModalFormButton>
        <Button type='text' danger onClick={() => deleteCompany(record._id)}>删除</Button>
      </Space>
    }
  })
  if (error) {
    return <Error />
  }
  if (isloading) {
    return <Loading />
  }
  return (
    <PageHeader
      title='公司信息'
      subTitle='这里编辑所有的公司信息'
      onCreate={{
        title: '新增公司',
        schema: companySchema,
        onSubmit: createCompany,
      }}
    >
      <ResultTable columns={columns} dataSource={data} rowKey='_id' pagination={{ pageSize: 50 }} />
    </PageHeader>
  )
}