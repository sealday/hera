import { Space } from "antd"
import moment from "moment"
import { useState } from "react"
import { useParams } from "react-router-dom"
import heraApi from "../../../api"
import { Error, Loading, ModalFormButton, PageHeader, PopconfirmButton, ResultTable } from "../../../components"
import { invoiceSchema } from "../../../schema"
import { genTableColumn } from "../../../utils/antd"

const DIRECTION2TITLE = {
  in: '进项发票',
  out: '销项发票',
}

export default () => {
  const { direction } = useParams()
  const title = DIRECTION2TITLE[direction]
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const getInvoiceList = heraApi.useGetInvoiceListQuery()
  const [createInvoice] = heraApi.useCreateInvoiceMutation()
  const [deleteInvoice] = heraApi.useDeleteInvoiceMutation()
  const [updateInvoice] = heraApi.useUpdateInvoiceMutation()
  if (getInvoiceList.isError) {
    return <Error />
  }
  if (getInvoiceList.isLoading) {
    return <Loading />
  }
  const columns = genTableColumn(invoiceSchema).concat([{
    key: 'action',
    title: '操作',
    render(_, item) {
      return (
        <Space>
          <ModalFormButton
            onSubmit={v => updateInvoice({ id: item._id, invoice: v })}
            title='编辑发票' type='link' schema={invoiceSchema} initialValues={item}>编辑</ModalFormButton>
          <PopconfirmButton  onConfirm={() => deleteInvoice(item._id)} danger title='确认删除'>删除</PopconfirmButton>
        </Space>
      )
    }
  }])
  const data = getInvoiceList.data
    .filter(record => record.direction === title)
    // TODO 处理日期
    .map(record => ({ ...record, date: moment(record.date) }))
  const initialValues = {
    direction: title,
  }
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const printContent = '还未实现'
  return (
    <PageHeader
      title={title}
      onPrintPreview={{
        content: printContent,
        title: '打印预览',
      }}
      onCreate={{
        title: '新增发票',
        onSubmit: createInvoice,
        schema: invoiceSchema,
        initialValues,
      }}
    >
      <ResultTable rowSelection={rowSelection} columns={columns} dataSource={data} rowKey='_id' schema={invoiceSchema} />
    </PageHeader>
  )
}