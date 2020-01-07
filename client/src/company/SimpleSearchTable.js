import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router'
import { Map } from 'immutable'
import {
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'

import { total_, toFixedWithoutTrailingZero } from '../utils'

/**
 * 提供排序功能的搜索结果表
 */
class SimpleSearchTable extends React.Component {

  getProjectName = id => {
    const { projects } = this.props
    const project = projects.get(id)
    return project ? project.company + project.name : '';
  }

  render() {
    const { search } = this.props

    const getTotal = (entries) => {

      let names = new Map()
      entries.forEach(entry => {
        names = names.update(entry.name, 0, total => total + total_(entry, this.props.products))
      })

      return names
    }

    return (
      <>
        <Card style={{ marginTop: '16px' }}>
          <CardContent>
            <table className="table table-bordered" style={{ width: '100%' }}>
              <thead>
              <tr>
                <th>时间</th>
                <th>车号</th>
                <th>单号</th>
                <th>原始单号</th>
                <th>出库</th>
                <th>入库</th>
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
                  <td>{this.getProjectName(entry.outStock) || entry.vendor}</td>
                  <td>{this.getProjectName(entry.inStock) || entry.vendor}</td>
                  <td>{entry.totalString}</td>
                  <td>
                    <Link to={`/company_record/${entry._id}`}>查看详情</Link>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </>
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
