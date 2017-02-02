/**
 * Created by seal on 31/01/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { total_, toFixedWithoutTrailingZero } from '../utils'
import { Link } from 'react-router'
import { Map } from 'immutable'

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

    // FIXME 只考虑了 销售、调拨、采购 三种情况
    const getDirection = entry => entry.type === '调拨'
      ? entry.inStock === this.props.store._id ? '入库' : '出库'
      : entry.type === '销售' ? '出库' : '入库'

    const getTotal = (entries) => {

      let names = new Map()
      entries.forEach(entry => {
        names = names.update(entry.name, 0, total => total + total_(entry))
      })

      let totals = []
      names.forEach((v, k) => {
        totals.push(k + '：' + toFixedWithoutTrailingZero(v))
      })

      return totals.join(' ')
    }

    return (
      <table className="table table-bordered">
        <thead>
        <tr>
          <th>时间</th>
          <th>车号</th>
          <th>订单号</th>
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
            <td>{getDirection(entry) === '出库' ? getProjectName(entry.inStock) : getProjectName(entry.outStock) || entry.vendor}</td>
            {/* 当没有公司情况的时候，会有对方单位，当两个都没有的时候，属于上年结转的单据 */}
            <td>{getDirection(entry)}</td>
            <td>{getTotal(entry.entries)}</td>
            <td>
              <Link to={`/transfer/${entry._id}`}>查看详情</Link>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    )
  }
}

const mapStateToProps = state => ({
  search: state.store.simpleSearch,
  projects: state.system.projects,
  articles: state.system.articles.toArray(),
  store: state.system.store,
})

export default connect(mapStateToProps)(SimpleSearchTable)