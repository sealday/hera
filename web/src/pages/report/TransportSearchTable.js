import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Map } from 'immutable'
import _ from 'lodash'
import { total_, toFixedWithoutTrailingZero } from '../../utils'
import { Link, ResultTable } from 'components'

/**
 * 提供排序功能的搜索结果表
 */
class SimpleSearchTable extends React.Component {
  render() {
    const { search, projects } = this.props

    const getProjectName = id => {
      const project = projects.get(id)
      return project ? project.company + project.name : '';
    }

    const getDirection = entry => entry.inStock === this.props.store._id ? '入库' : '出库'

    const getTotal = (entries) => {

      let names = new Map()
      entries.forEach(entry => {
        names = names.update(entry.name, 0, total => total + total_(entry, this.props.products))
      })

      return names
    }

    let inStore = new Map() // 入库
    let outStore = new Map() // 出库
    let store = new Map()

    if (search) {
      // console.log(search)
      search.forEach(entry => {
        let totals = []
        getTotal(entry.entries).forEach((v, k) => {
          totals.push(k + '：' + toFixedWithoutTrailingZero(v)) //拼凑显示的字符串

          if (getDirection(entry) === '入库') {
            inStore = inStore.update(k, 0, total => total + v)
            store = store.update(k, 0, total => total + v)
          } else {
            outStore = outStore.update(k, 0, total => total + v)
            store = store.update(k, 0, total => total - v)
          }
        })

        entry.totalString = totals.join(' ')
        //计算价格
        const transport=entry.transport
        entry['price']=toFixedWithoutTrailingZero(transport.price * transport.weight + _.toNumber(transport.extraPrice ? transport.extraPrice : 0))+'元'
        
      })
    }


  const columns = [
    { key: 'outDate', title: '日期', dataIndex: 'outDate', render: (date) => moment(date).format('YYYY-MM-DD'), width: '114px' },
    { key: 'carNumber', title: '车号', dataIndex: 'carNumber', width: '100px' },
    { key: 'number', title: '单号', dataIndex: 'number', width: '58px' },
    { key: 'originalOrder', title: '原始单号', dataIndex: 'originalOrder', width: '100px' },
    { key: 'project', title: '项目部', render: (_, entry) => getDirection(entry) === '出库' ? getProjectName(entry.inStock) : getProjectName(entry.outStock) || entry.vendor },
    { key: 'direction', title: '出入库', render: (_, entry) => getDirection(entry), width: '58px' },
    { key: 'totalString', title: '内容', dataIndex: 'totalString'},
    { key: 'price', title: '总价', dataIndex:'price'},
    { key: 'action', title: '操作', render: (_, entry) => <Link to={`/transport/${entry._id}`}>详情</Link>, width: '44px' },
  ]

    const storeRows = []
    store.forEach((v, k) => {
      storeRows.push({
        key: k,
        name: k,
        out: toFixedWithoutTrailingZero(outStore.get(k, 0)),
        in: toFixedWithoutTrailingZero(inStore.get(k, 0)),
        total: toFixedWithoutTrailingZero(v),
      })
    })

    const summaryColumns = [
      { key: 'name', title: '名称', dataIndex: 'name' },
      { key: 'out', title: '出库数量', dataIndex: 'out' },
      { key: 'in', title: '入库数量', dataIndex: 'in' },
      { key: 'total', title: '小计', dataIndex: 'total' },
    ]

    return (
      <ResultTable
        columns={columns}
        dataSource={search}
        summaryColumns={summaryColumns}
        summaryDataSource={storeRows}
      />
    )
  }
}

const mapStateToProps = state => ({
  projects: state.system.projects,
  articles: state.system.articles.valueSeq().toArray(),
  products: state.system.products,
  store: state.system.store,
})

export default connect(mapStateToProps)(SimpleSearchTable)