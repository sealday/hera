import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Map } from 'immutable'
import {
  Card,
  CardContent,
} from '@material-ui/core'

import { total_, toFixedWithoutTrailingZero } from '../utils'

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
      })
    }

    let storeRows = []
    store.forEach((v, k) => {
      storeRows.push(<tr key={v}>
        <td>{k}</td>
        <td>{toFixedWithoutTrailingZero(outStore.get(k, 0))}</td>
        <td>{toFixedWithoutTrailingZero(inStore.get(k, 0))}</td>
        <td>{toFixedWithoutTrailingZero(v)}</td>
      </tr>)
    })

    return (
      <Card style={{ marginTop: '16px' }}>
        <CardContent>
          <table className="table table-bordered" style={{ width: '100%' }}>
            <thead>
            <tr>
              <th>时间</th>
              <th>车号</th>
              <th>单号</th>
              <th>原始单号</th>
              <th>项目部</th>
              <th>出入库 </th>
              <th>订单内容</th>
              <th/>
            </tr>
            </thead>
            <tbody>
            {search && search.map((entry, index) => (
              <tr key={index}>
                <td>{moment(entry.outDate).format('YYYY-MM-DD')}</td>
                <td>{entry.carNumber}</td>
                <td>{entry.number}</td>
                <td>{entry.originalOrder}</td>
                <td>{getDirection(entry) === '出库' ? getProjectName(entry.inStock) : getProjectName(entry.outStock) || entry.vendor}</td>
                {/* 当没有公司情况的时候，会有对方单位，当两个都没有的时候，属于上年结转的单据 */}
                <td>{getDirection(entry)}</td>
                <td>{entry.totalString}</td>
                <td>
                  <Link to={`/transport/${entry._id}`}>查看运输单</Link>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  projects: state.system.projects,
  articles: state.system.articles.toArray(),
  products: state.system.products,
  store: state.system.store,
})

export default connect(mapStateToProps)(SimpleSearchTable)
