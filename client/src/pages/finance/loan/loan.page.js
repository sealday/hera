import { Space } from "antd"
import moment from "moment"
import heraApi from "../../../api"
import { Error, Loading, ModalFormButton, PageHeader, PopconfirmButton, ResultTable } from "../../../components"
import { loanSchema } from "../../../schema"
import { genTableColumn } from "../../../utils/antd"

export default () => {
  const getLoanList = heraApi.useGetLoanListQuery()
  const [createLoan] = heraApi.useCreateLoanMutation()
  const [deleteLoan] = heraApi.useDeleteLoanMutation()
  const [updateLoan] = heraApi.useUpdateLoanMutation()
  if (getLoanList.isError) {
    return <Error />
  }
  if (getLoanList.isLoading) {
    return <Loading />
  }
  const columns = genTableColumn(loanSchema).concat([{
    key: 'action',
    title: '操作',
    render(_, item) {
      return (
        <Space>
          <ModalFormButton
            onSubmit={v => updateLoan({ id: item._id, loan: v })}
            title='编辑贷款信息' type='link' schema={loanSchema} initialValues={item}>编辑</ModalFormButton>
          <PopconfirmButton  onConfirm={() => deleteLoan(item._id)} danger title='确认删除'>删除</PopconfirmButton>
        </Space>
      )
    }
  }])
  const data = getLoanList.data
    // TODO 处理日期
    .map(record => ({ ...record, date: moment(record.date) }))
  return (
    <PageHeader
      title='贷款管理'
      onCreate={{
        title: '期初录入',
        onSubmit: createLoan,
        schema: loanSchema,
      }}
    >
      <ResultTable columns={columns} dataSource={data} rowKey='_id' schema={loanSchema} />
    </PageHeader>
  )
}