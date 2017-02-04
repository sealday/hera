/**
 * Created by seal on 31/01/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { total } from '../utils'
import { Link } from 'react-router'

/**
 * 提供排序功能的搜索结果表
 */
class SearchTable extends React.Component {
  render() {
    const { search, projects } = this.props
    const getProjectName = id => {
      const project = projects.get(id)
      return project ? project.company + project.name : '';
    }
    return (
      <table className="table table-bordered">
        <thead>
        <tr>
          <th>时间</th>
          <th>订单号</th>
          <th>出库</th>
          <th>入库</th>
          <th>名称</th>
          <th>规格</th>
          <th>数量</th>
          <th>小计</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {search && search.map((entry, index) => (
          <tr key={index}>
            <th>{moment(entry.outDate).format('YYYY-MM-DD')}</th>
            <td>{entry.number}</td>
            {/* 当没有公司情况的时候，会有对方单位，当两个都没有的时候，属于上年结转的单据 */}
            <td>{getProjectName(entry.outStock) || entry.vendor}</td>
            <td>{getProjectName(entry.inStock) || entry.vendor}</td>
            <td>{entry.name}</td>
            <td>{entry.size}</td>
            <td>{entry.count}</td>
            <td>{total(entry.count, entry.size)}</td>
            <td>
              <Link to={`/record/${entry._id}`}>查看详情</Link>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    )
  }
}

const mapStateToProps = state => ({
  search: state.store.search,
  projects: state.system.projects
})

export default connect(mapStateToProps)(SearchTable)