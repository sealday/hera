/**
 * Created by seal on 31/01/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { RENT } from '../actions'
import { currencyFormat, numberFormat } from '../utils'
import shortId from 'shortid'
import moment from 'moment'

/**
 * 提供排序功能的搜索结果表
 */
class SimpleSearchTable extends React.Component {

  render() {
    const { rent } = this.props

    return (
      <div className="panel panel-default">
        <table className="table">
          <thead>
          <tr>
            <th>日期</th>
            <th>出入库</th>
            <th>名称</th>
            <th>规格</th>
            <th>数量</th>
            <th>天数</th>
            <th>金额</th>
            <th>运费</th>
          </tr>
          </thead>
          <tbody>
          {rent.list.map((item) => (
            <tr key={shortId.generate()}>
              <td>{item.history ? '上期结存' :  moment(item.outDate).format('YYYY-MM-DD')}</td>
              <td>{item.inOut}</td>
              <td>{item.name}</td>
              <td>{item.size}</td>
              <td>{item.count}</td>
              <td>{item.days}</td>
              <td style={{ textAlign: 'right' }}>{currencyFormat(item.price)}</td>
              <td>{item.freight}</td>
            </tr>
          ))}
          </tbody>
        </table>
        {rent.list.length > 0 && <ul className="list-group">
          <li className="list-group-item">金额：{numberFormat(rent.group[0].price)} 元</li>
          <li className="list-group-item">运费：{numberFormat(rent.group[0].freight)} 元</li>
        </ul>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  rent: state.results.get(RENT, { list: [], group: [ { price: 0, freight: 0 } ] })
})

export default connect(mapStateToProps)(SimpleSearchTable)
