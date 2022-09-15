import React from 'react'
import { connect } from 'react-redux'
import shortId from 'shortid'

import { currencyFormat, numberFormat, dateFormat } from '../../utils'

class SimpleSearchTable extends React.Component {

  render() {
    const { rent, onLoad } = this.props

    return (
      [
        <table ref={onLoad} padding="dense" key={0}>
          <thead>
            <tr>
              <td>日期</td>
              <td>出入库</td>
              <td>名称</td>
              <td>规格</td>
              <td>单位</td>
              <td>数量</td>
              <td>单价</td>
              <td>天数</td>
              <td>金额</td>
              <td>运费</td>
            </tr>
          </thead>
          <tbody>
            {rent.history.map((item) => (
              <tr key={shortId.generate()}>
                <td>上期结存</td>
                <td />
                <td>{item.name}</td>
                <td />
                <td>{item.unit}</td>
                <td className="text-right">{numberFormat(item.count)}</td>
                <td className="text-right">{currencyFormat(item.unitPrice, 4)}</td>
                <td>{item.days}</td>
                <td className="text-right">{currencyFormat(item.price)}</td>
                <td />
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
        </table>,
        (rent.list.length > 0 || rent.history.length > 0) && <ul key={1}>
          {rent.nameGroup.map(item => (
            <li key={shortId.generate()}>{item.name}： {numberFormat(item.count)} {item.unit}</li>
          ))}
          <li key="price">金额：{numberFormat(rent.group.price)} 元</li>
          <li key="freight">运费：{numberFormat(rent.group.freight)} 元</li>
        </ul>,
      ]
    )
  }
}

export default connect()(SimpleSearchTable)
