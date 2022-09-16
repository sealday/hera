import { Card, Table } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import shortId from 'shortid'

import { currencyFormat, numberFormat, dateFormat } from '../../utils'

class SimpleSearchTable extends React.Component {

  render() {
    const { rent, onLoad } = this.props
    const columns = [
      { key: 'outDate', dataIndex: 'outDate', title: '日期' },
      { key: 'inOut', dataIndex: 'inOut', title: '出入库' },
      { key: 'name', dataIndex: 'name', title: '名称' },
      { key: 'size', dataIndex: 'size', title: '规格' },
      { key: 'unit', dataIndex: 'unit', title: '单位' },
      { key: 'count', dataIndex: 'count', title: '数量' },
      { key: 'unitPrice', dataIndex: 'unitPrice', title: '金额' },
      { key: 'days', dataIndex: 'days', title: '天数' },
      { key: 'price', dataIndex: 'price', title: '金额' },
      { key: 'freight', dataIndex: 'freight', title: '运费' },
    ]
    const dataSource = rent.history.map((item) => ({
      key: shortId.generate(),
      outDate: '上期结存',
      inOut: '',
      name: item.name,
      size: '',
      unit: item.unit,
      count: numberFormat(item.count),
      unitPrice: currencyFormat(item.unitPrice, 4),
      days: item.days,
      price: currencyFormat(item.price),
    })).concat(rent.list.map((item) => ({
      ...item,
      key: shortId.generate(),
      outDate: dateFormat(item.outDate),
      count: numberFormat(item.count),
      unitPrice: currencyFormat(item.unitPrice, 4),
      price: currencyFormat(item.price),
      freight: currencyFormat(item.freight),
    })))


    return (
      <Card bordered={false} >
        <Table columns={columns} dataSource={dataSource} pagination={null} />
        {(rent.list.length > 0 || rent.history.length > 0) && <ul key={1}>
          {rent.nameGroup.map(item => (
            <li key={shortId.generate()}>{item.name}： {numberFormat(item.count)} {item.unit}</li>
          ))}
          <li key="price">金额：{numberFormat(rent.group.price)} 元</li>
          <li key="freight">运费：{numberFormat(rent.group.freight)} 元</li>
        </ul>}
      </Card>
    )
  }
}

export default connect()(SimpleSearchTable)
