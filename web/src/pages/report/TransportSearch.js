import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

import SearchForm from './TransportSearchForm'
import SearchTable from './TransportSearchTable'
import { queryStore } from '../../actions'
import { PageHeader } from '../../components'
const key = '运输单查询'

export default () => {

  const dispatch = useDispatch()
  const { records, store } = useSelector(state => ({
    records: state.results.get(key, []),
    store: state.system.store,
  }))

  const search = condition => {
    dispatch(queryStore(key, {
      ...condition,
      hasTransport: true, // 这个里面最重要的参数
      self: store._id,
      endDate: dayjs(condition.endDate).add(1, 'day')
    }))
  }

  return (
    <PageHeader
      title='运输单查询'
      searchForm={{
        Form: SearchForm,
        onSubmit: search,
      }}
    >
      <SearchTable search={records} />
    </PageHeader>
  )
}