/**
 * Created by seal on 31/01/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { RENT } from '../actions'
import { currencyFormat, numberFormat, dateFormat } from '../utils'
import shortId from 'shortid'

/**
 * 提供排序功能的搜索结果表
 */
class SimpleSearchTable extends React.Component {

  render() {
    const { rent, onLoad } = this.props

    return (
      <div className="panel panel-default">
        <table className="table" ref={onLoad}>
          <thead>
          <tr>
            <th>日期</th>
            <th>出入库</th>
            <th>名称</th>
            <th>规格</th>
            <th>单位</th>
            <th className="text-right">数量</th>
            <th className="text-right">单价</th>
            <th>天数</th>
            <th className="text-right">金额</th>
            <th className="text-right">运费</th>
          </tr>
          </thead>
          <tbody>
          {rent.history.map((item) => (
            <tr key={shortId.generate()}>
              <td>上期结存</td>
              <td/>
              <td>{item.name}</td>
              <td/>
              <td>{item.unit}</td>
              <td className="text-right">{numberFormat(item.count)}</td>
              <td className="text-right">{currencyFormat(item.unitPrice, 4)}</td>
              <td>{item.days}</td>
              <td className="text-right">{currencyFormat(item.price)}</td>
              <td/>
            </tr>
          ))}
          {rent.list.map((item) => (
            <tr key={shortId.generate()}>
              <td>{dateFormat(item.outDate)}</td>
              <td>{item.inOut}</td>
              <td>{item.name}</td>
              <td>{item.size}</td>
              <td>{item.unit}</td>
              <td className="text-right">{numberFormat(item.count)}</td>
              <td className="text-right">{currencyFormat(item.unitPrice, 4)}</td>
              <td>{item.days}</td>
              <td className="text-right">{currencyFormat(item.price)}</td>
              <td className="text-right">{currencyFormat(item.freight)}</td>
            </tr>
          ))}
          </tbody>
        </table>
        {(rent.list.length > 0 || rent.history.length > 0) && <ul className="list-group">
          {rent.nameGroup.map(item => (
            <li key={shortId.generate()} className="list-group-item">{item.name} {numberFormat(item.count)}{item.unit}</li>
          ))}
        </ul>}
        {/* 避免在没有列表信息的时候显示 */}
        {(rent.list.length > 0 || rent.history.length > 0) && <ul className="list-group">
          <li className="list-group-item">金额：{numberFormat(rent.group[0].price)} 元</li>
          <li className="list-group-item">运费：{numberFormat(rent.group[0].freight)} 元</li>
        </ul>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  rent: state.results.get(RENT, { history: [], list: [], group: [ { price: 0, freight: 0 } ] })
})

export default connect(mapStateToProps)(SimpleSearchTable)
