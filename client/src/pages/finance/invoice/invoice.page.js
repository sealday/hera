import { useParams } from "react-router-dom"
import heraApi from "../../../api"
import { Error, Loading, PageHeader, ResultTable } from "../../../components"
import { invoiceSchema } from "../../../schema"

const DIRECTION2TITLE = {
  in: '进项发票',
  out: '销项发票',
}

export default () => {
  const { direction } = useParams()
  const title = DIRECTION2TITLE[direction]
  const getInvoiceList = heraApi.useGetInvoiceListQuery()
  const [createInvoice] = heraApi.useCreateInvoiceMutation()
  if (getInvoiceList.isError) {
    return <Error />
  }
  if (getInvoiceList.isLoading) {
    return <Loading />
  }
  const columns = invoiceSchema
    .filter(item => item.type !== 'list')
    .map(item => ({ key: item.name, title: item.label, dataIndex: item.name }))
  const data = getInvoiceList.data

  return (
    <PageHeader
      title={title}
      onCreate={{
        title: '新增发票',
        onSubmit: createInvoice,
        schema: invoiceSchema,
      }}
    >
      <ResultTable columns={columns} dataSource={data} />
    </PageHeader>
  )
}