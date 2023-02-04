import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Map } from 'immutable'
import {
  toFixedWithoutTrailingZero,
  makeKeyFromNameSize,
  formatNumber,
  oldProductStructure,
  getScale,
} from '../../utils'
import { requestStore } from '../../actions'
import StoreForm from './StoreForm'
import { PageHeader, TreeTable } from '../../components'
import { strings } from 'hera-core'

const Store = () => {
  const form = React.useRef()
  const dispatch = useDispatch()
  const { thisArticles, products, store } = useSelector(state => ({
    thisArticles: state.system.articles,
    products: state.system.products,
    store: state.system.store,
  }))
  const stocks = useSelector(state => state.store.stocks)
  const [state, setState] = useState({
    project: store._id,
    showing: new Map(),
  })

  const query = data => {
    if (data.project) {
      dispatch(requestStore({
        type: data.type,
        project: data.project,
        startDate: data.startDate,
        endDate: moment(data.endDate).add(1, 'day'),
      }))
      setState({
        project: store._id,
        showing: new Map() // 重置状态显示
      })
    }
  }

  const getRecords = (stock) => {
    const inRecords = stock.inRecords
    const outRecords = stock.outRecords
    let inRecordMap = {}
    inRecords.forEach(record => {
      inRecordMap[makeKeyFromNameSize(record._id.name, record._id.size)] = record.sum
    })
    let outRecordMap = {}
    outRecords.forEach(record => {
      outRecordMap[makeKeyFromNameSize(record._id.name, record._id.size)] = record.sum
    })

    let records = [] // [{ total, entries }]
    const articles = oldProductStructure(thisArticles.valueSeq().toArray())
    articles.forEach(article => {
      // 算每一项
      let inTotal = 0
      let outTotal = 0
      let total = 0

      let record = {
        total: null,
        entries: []
      }

      // 如果有规格数据的话
      article.sizes.forEach(size => {
        const key = makeKeyFromNameSize(article.name, size)
        let value = {}
        value.delta = 0;
        let exists = false
        if (key in inRecordMap) {
          value.in = inRecordMap[key]
          value.delta = value.in;
          value.inTotal = toFixedWithoutTrailingZero(inRecordMap[key] * getScale(products[key]))
          inTotal += Number(value.inTotal)
          exists = true
        }
        if (key in outRecordMap) {
          value.out = outRecordMap[key]
          value.delta -= value.out;
          value.outTotal = toFixedWithoutTrailingZero(outRecordMap[key] * getScale(products[key]))
          outTotal += Number(value.outTotal)
          exists = true
        }

        if (exists) {
          value.total = toFixedWithoutTrailingZero((value.inTotal || 0) - (value.outTotal || 0))
          record.entries.push({
            type: article.type,
            name: article.name,
            size: size,
            ...value
          })
        }
      })

      // 如果没有规格数据，比如电脑
      if (article.sizes.length === 0) {
        const size = undefined
        const key = makeKeyFromNameSize(article.name, size)
        let value = {}
        value.delta = 0;
        let exists = false
        if (key in inRecordMap) {
          value.in = inRecordMap[key]
          value.delta += value.in
          value.inTotal = toFixedWithoutTrailingZero(inRecordMap[key] * getScale(products[key]))
          inTotal += Number(value.inTotal)
          exists = true
        }
        if (key in outRecordMap) {
          value.out = outRecordMap[key]
          value.delta -= value.out
          value.outTotal = toFixedWithoutTrailingZero(outRecordMap[key] * getScale(products[key]))
          outTotal += Number(value.outTotal)
          exists = true
        }

        if (exists) {
          value.total = toFixedWithoutTrailingZero((value.inTotal || 0) - (value.outTotal || 0))
          record.entries.push({
            type: article.type,
            name: article.name,
            size: size,
            ...value
          })
        }
      }

      // 计算合计
      if (inTotal !== 0 || outTotal !== 0) {
        total = toFixedWithoutTrailingZero(inTotal - outTotal)
        record.total = {
          type: article.type,
          name: article.name,
          inTotal: toFixedWithoutTrailingZero(inTotal),
          outTotal: toFixedWithoutTrailingZero(outTotal),
          total
        }

        records.push(record)
      }
    })
    return records
  }

  const columns = [
    {
      key: 'type',
      title: '类别',
      dataIndex: 'type',
    },
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    },
    {
      key: 'size',
      title: '规格',
      dataIndex: 'size',
    },
    {
      key: 'in',
      title: '入库数量',
      dataIndex: 'in',
    },
    {
      key: 'out',
      title: '出库数量',
      dataIndex: 'out',
    },
    {
      key: 'delta',
      title: '结存数量',
      dataIndex: 'delta',
    },
    {
      key: 'total',
      title: '小计',
      dataIndex: 'total',
    },
  ]
  const dataSource = []
  if (state.project && stocks.get(state.project)) {
    const records = getRecords(stocks.get(state.project))
    records.forEach((record, index) => {
      dataSource.push({
        key: index,
        type: record.total.type,
        name: record.total.name,
        size: record.total.size,
        in: formatNumber(record.total.in),
        out: formatNumber(record.total.out),
        delta: '',
        total: formatNumber(record.total.total),
        children: record.entries.map((record, subIndex) => ({
          key: index + '.' + subIndex,
          type: '',
          name: '',
          size: record.size,
          in: formatNumber(record.in),
          out: formatNumber(record.out),
          delta: formatNumber(record.delta),
          total: formatNumber(record.total),
        }))
      })
    })
  }

  return (
    <PageHeader
      title='库存查询'
      searchForm={{
        Form: StoreForm,
        initialValues: {
          startDate: moment().startOf('day'),
          endDate: moment().startOf('day'),
          type: strings.quickMapping.TRANSFER,
          project: store._id,
        },
        onSubmit: query,
      }}
    >
      <TreeTable columns={columns} dataSource={dataSource} />
    </PageHeader>

  )
}

export default Store