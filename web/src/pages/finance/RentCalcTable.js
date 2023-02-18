import { Card, Divider, Table } from 'antd'
import React from 'react'
import shortId from 'shortid'

import { currencyFormat, numberFormat, dateFormat } from '../../utils'

export default ({ rent }) => {
  // const columns = [
  //   { key: 'outDate', dataIndex: 'outDate', title: '日期' },
  //   { key: 'inOut', dataIndex: 'inOut', title: '出入库' },
  //   { key: 'name', dataIndex: 'name', title: '名称' },
  //   { key: 'category', dataIndex: 'category', title: '类别' },
  //   { key: 'unit', dataIndex: 'unit', title: '单位' },
  //   { key: 'count', dataIndex: 'count', title: '数量' },
  //   { key: 'unitPrice', dataIndex: 'unitPrice', title: '单价' },
  //   { key: 'days', dataIndex: 'days', title: '天数' },
  //   { key: 'price', dataIndex: 'price', title: '金额' },
  // ]

  const columns = [
    { key: 'name', dataIndex: 'name', title: '料具名称' },
    { key: 'startDate', dataIndex: 'startDate', title: '起租日期' },
    { key: 'endDate', dataIndex: 'endDate', title: '结算日期' },
    { key: 'count', dataIndex: 'count', title: '数量' },
    { key: 'unit', dataIndex: 'unit', title: '单位' },
    { key: 'unitPrice', dataIndex: 'unitPrice', title: '单价(元)' },
    { key: 'days', dataIndex: 'days', title: '天数' },
    { key: 'price', dataIndex: 'price', title: '金额(元)' },
    { key: 'notes', dataIndex: 'category', title: '备注' },
  ]

  const dataSource = rent.history
    .map(item => ({
      key: shortId.generate(),
      category: item.category,
      outDate: item.outDate ? item.outDate : '上期结存',
      startDate: dateFormat(rent?.start),
      endDate: dateFormat(rent?.end),
      inOut: '',
      name: item.name,
      unit: item.unit,
      count: item.count ? numberFormat(item.count) : '',
      unitPrice: item.unitPrice ? currencyFormat(item.unitPrice, 4) : '',
      days: item.days,
      price: currencyFormat(item.price),
    }))
    .concat(
      rent.list.map(item => ({
        ...item,
        key: shortId.generate(),
        outDate: dateFormat(item.outDate),
        count: item.count ? numberFormat(item.count) : '',
        unitPrice: item.unitPrice ? currencyFormat(item.unitPrice, 4) : '',
        price: currencyFormat(item.price),
        startDate: dateFormat(
          item.inOut === '入库' ? rent?.start : item.outDate
        ),
        endDate: dateFormat(item.inOut === '入库' ? item.outDate : rent?.end),
      }))
    )

  const columnsSecond = columns.map(ele => {
    if (ele.key === 'startDate') {
      return { key: 'outDate', dataIndex: 'outDate', title: '确认日期' }
    } else if (ele.key === 'endDate') {
      return { key: 'category', dataIndex: 'category', title: '类别' }
    } else {
      return ele
    }
  })

  const dataSourceFirst = []
  const dataSourceSecond = []
  for (const ele of dataSource) {
    if (ele.category === '租金') {
      dataSourceFirst.push(ele)
    } else {
      dataSourceSecond.push(ele)
    }
  }
  return (
    <Card bordered={false}>
      {dataSourceFirst.length > 0 && (
        <Table
          columns={columns}
          dataSource={dataSourceFirst}
          pagination={false}
        />
      )}
      {dataSourceSecond.length > 0 && (
        <Table
          columns={columnsSecond}
          dataSource={dataSourceSecond}
          pagination={false}
        />
      )}
      {/* <Divider>汇总</Divider>
      {(rent.list.length > 0 || rent.history.length > 0) && (
        <ul key={1}>
          {rent.nameGroup.map(item => (
            <li key={shortId.generate()}>
              {item.name}： {numberFormat(item.count)} {item.unit}
            </li>
          ))}
          <li key="price">金额：{numberFormat(rent.group.price)} 元</li>
        </ul>
      )} */}
    </Card>
  )
}