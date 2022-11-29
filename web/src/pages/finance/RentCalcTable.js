import { Card, Divider, Table } from 'antd'
import React from 'react'
import shortId from 'shortid'

import { currencyFormat, numberFormat, dateFormat } from '../../utils'

export default ({ rent }) => {
  const columns = [
    { key: 'outDate', dataIndex: 'outDate', title: '日期' },
    { key: 'inOut', dataIndex: 'inOut', title: '出入库' },
    { key: 'name', dataIndex: 'name', title: '名称' },
    { key: 'category', dataIndex: 'category', title: '类别' },
    { key: 'unit', dataIndex: 'unit', title: '单位' },
    { key: 'count', dataIndex: 'count', title: '数量' },
    { key: 'unitPrice', dataIndex: 'unitPrice', title: '单价' },
    { key: 'days', dataIndex: 'days', title: '天数' },
    { key: 'price', dataIndex: 'price', title: '金额' },
  ]
  const dataSource = rent.history.map((item) => ({
    key: shortId.generate(),
    category: item.category,
    outDate: item.outDate ? item.outDate : '上期结存',
    inOut: '',
    name: item.name,
    unit: item.unit,
    count: item.count ? numberFormat(item.count) : '',
    unitPrice: item.unitPrice ? currencyFormat(item.unitPrice, 4) : '',
    days: item.days,
    price: currencyFormat(item.price),
  })).concat(rent.list.map((item) => ({
    ...item,
    key: shortId.generate(),
    outDate: dateFormat(item.outDate),
    count: item.count ? numberFormat(item.count) : '',
    unitPrice: item.unitPrice ? currencyFormat(item.unitPrice, 4) : '',
    price: currencyFormat(item.price),
  })))


  return (
    <Card bordered={false} >
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <Divider>汇总</Divider>
      {(rent.list.length > 0 || rent.history.length > 0) && <ul key={1}>
        {rent.nameGroup.map(item => (
          <li key={shortId.generate()}>{item.name}： {numberFormat(item.count)} {item.unit}</li>
        ))}
        <li key="price">金额：{numberFormat(rent.group.price)} 元</li>
      </ul>}
    </Card>
  )
}