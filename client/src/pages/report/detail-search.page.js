import { Form } from "antd"
import { useState } from "react"
import heraApi from "../../api"
import { PageHeader, ResultTable } from "../../components"
import { detailSearchFormSchema, detailSearchTableSchema } from "../../schema"
import { genTableColumn } from "../../utils/antd"

export default () => {
  const [detailSearch, searchResult] = heraApi.useDetailSearchMutation()

  const handleSubmit = (v) => {
    detailSearch(v)
  }

  const columns = genTableColumn(detailSearchTableSchema).concat({
    key: 'action', title: '操作'
  })
  console.log(searchResult.data)
  const dataSource = []

  return (
    <PageHeader
      title='明细查询'
      search={{
        schema: detailSearchFormSchema,
        onSubmit: handleSubmit,
      }}
    >
      <ResultTable columns={columns} dataSource={dataSource} />
    </PageHeader>
  )
}