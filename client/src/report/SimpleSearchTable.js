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
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">查询结果</h3>
        </div>
        <table className="table table-bordered">
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
                <Link to={`/transfer/${entry._id}`}>查看详情</Link>
              </td>
            </tr>
          ))}
          </tbody>
        </table>

        {storeRows.length > 0 &&
        <div className="panel-heading">
          <h3 className="panel-title">查询结果统计</h3>
        </div>
        }
        {storeRows.length > 0 &&
        <table className="table table-bordered">
          <thead>
          <tr>
            <th>名称</th>
            <th>出库数量</th>
            <th>入库数量</th>
            <th>小计</th>
          </tr>
          </thead>
          <tbody>
          {storeRows}
          </tbody>
        </table>
        }
      </div>
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