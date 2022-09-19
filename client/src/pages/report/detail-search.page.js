import { Form } from "antd"
import _ from "lodash"
import moment from "moment"
import { useState } from "react"
import { useSelector } from "react-redux"
import heraApi from "../../api"
import { PageHeader, ResultTable } from "../../components"
import { detailSearchFormSchema, detailSearchTableSchema } from "../../schema"
import { genTableColumn } from "../../utils/antd"

export default () => {
  const [detailSearch, searchResult] = heraApi.useDetailSearchMutation()
  const store = useSelector(state => state.system.store)

  const handleSubmit = (v) => {
    detailSearch({
      ...v,
      storeId: store._id,
      dateRange: undefined,
      startDate: _.size(v.dateRange) === 2 ? v.dateRange[0].startOf('day') : undefined,
      endDate: _.size(v.dateRange) === 2 ? v.dateRange[1].add(1, 'day').startOf('day') : undefined,
    })
  }

  const columns = genTableColumn(detailSearchTableSchema).concat({
    key: 'action', title: '操作'
  })
  const dataSource = searchResult.data

  return (
    <PageHeader
      title='明细查询'
      search={{
        schema: detailSearchFormSchema,
        onSubmit: handleSubmit,
      }}
    >
      <ResultTable columns={columns} dataSource={dataSource} pagination={{ pageSize: 100 }} />
    </PageHeader>
  )
}