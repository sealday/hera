import { useParams } from "react-router-dom"
import { PageHeader, ResultTable } from "../../../components"
import { invoiceSchema } from "../../../schema"

const DIRECTION2TITLE = {
  in: '进项发票',
  out: '销项发票',
}

export default () => {
  const { direction } = useParams()
  const title = DIRECTION2TITLE[direction]
  const columns = invoiceSchema
    .filter(item => item.type !== 'list')
    .map(item => ({ key: item.name, title: item.label, dataIndex: item.name }))
  const data = []

  return (
    <PageHeader
      title={title}
    >
      <ResultTable columns={columns} dataSource={data} />
    </PageHeader>
  )
}