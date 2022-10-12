import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Map } from 'immutable'

import { total_, toFixedWithoutTrailingZero } from '../../utils'
import { ResultTable, Link } from '../../components'

export default ({ search, isCompany }) => {

  const { projects, products, store } = useSelector(state => ({
    projects: state.system.rawProjects,
    products: state.system.products,
    store: state.system.store,
  }))

  const getDirection = entry => entry.inStock === store._id ? '入库' : '出库'

  const getOtherSize = entry => {
    return getDirection(entry) === '出库' ? getProjectName(entry.inStock) : getProjectName(entry.outStock)
  }

  const getProjectName = id => {
    const project = projects.get(id)
    return project ? project.company + project.name : '';
  }

  const getTotal = (entries) => {

    let names = new Map()
    entries.forEach(entry => {
      names = names.update(entry.name, 0, total => total + total_(entry, products))
    })

    return names
  }

  let inStore = new Map() // 入库
  let outStore = new Map() // 出库
  let summary = new Map()

  if (search) {
    search.forEach(entry => {
      let totals = []
      getTotal(entry.entries).forEach((v, k) => {
        totals.push(k + '：' + toFixedWithoutTrailingZero(v)) //拼凑显示的字符串

        if (!isCompany) {
          if (getDirection(entry) === '入库') {
            inStore = inStore.update(k, 0, total => total + v)
            summary = summary.update(k, 0, total => total + v)
          } else {
            outStore = outStore.update(k, 0, total => total + v)
            summary = summary.update(k, 0, total => total - v)
          }
        }
      })

      entry.totalString = totals.join(' ')
    })
  }

  const storeRows = []
  if (!isCompany) {
    summary.forEach((v, k) => {
      storeRows.push({
        key: k,
        name: k,
        out: toFixedWithoutTrailingZero(outStore.get(k, 0)),
        in: toFixedWithoutTrailingZero(inStore.get(k, 0)),
        total: toFixedWithoutTrailingZero(v),
      })
    })
  }

  const columns = [
    { key: 'type', title: '类别', dataIndex: 'type', width: '44px' },
    { key: 'outDate', title: '日期', dataIndex: 'outDate', render: (date) => moment(date).format('YYYY-MM-DD'), width: '114px' },
    { key: 'carNumber', title: '车号', dataIndex: 'carNumber', width: '100px' },
    { key: 'number', title: '单号', dataIndex: 'number', width: '58px' },
    { key: 'originalOrder', title: '原始单号', dataIndex: 'originalOrder', width: '100px' },
    isCompany
      ? { key: 'outStock', title: '出库', dataIndex: 'outStock', render: projectId => getProjectName(projectId) }
      : { key: 'project', title: '项目部', render: (_, entry) => getOtherSize(entry) },
    isCompany
      ? { key: 'inStock', title: '入库', dataIndex: 'inStock', render: projectId => getProjectName(projectId) }
      : { key: 'direction', title: '出入库', render: (_, entry) => getDirection(entry), width: '58px' },
    { key: 'totalString', title: '内容', dataIndex: 'totalString'},
    isCompany
      ? { key: 'action', title: '操作', render: (_, entry) => <Link to={`/company_record/${entry._id}`}>详情</Link>, width: '44px' }
      : { key: 'action', title: '操作', render: (_, entry) => <Link to={`/record/${entry._id}`}>详情</Link>, width: '44px' },
  ]

  const summaryColumns = [
    { key: 'name', title: '名称', dataIndex: 'name' },
    { key: 'out', title: '出库数量', dataIndex: 'out' },
    { key: 'in', title: '入库数量', dataIndex: 'in' },
    { key: 'total', title: '小计', dataIndex: 'total' },
  ]

  return (
    <div>
      <ResultTable
        dataSource={search}
        columns={columns}
        summaryColumns={summaryColumns}
        summaryDataSource={storeRows}
      />
    </div>
  )
}