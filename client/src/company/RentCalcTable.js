import React from 'react'
import { connect } from 'react-redux'
import shortId from 'shortid'
import Table from '@material-ui/core/Table'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

import { currencyFormat, numberFormat, dateFormat } from '../utils'

/**
 * 提供排序功能的搜索结果表
 */
class SimpleSearchTable extends React.Component {

  render() {
    const { rent, onLoad } = this.props

    return (
      [
        <Table ref={onLoad} padding="dense" key={0}>
          <TableHead>
            <TableRow>
              <TableCell>日期</TableCell>
              <TableCell>出入库</TableCell>
              <TableCell>名称</TableCell>
              <TableCell>规格</TableCell>
              <TableCell>单位</TableCell>
              <TableCell>数量</TableCell>
              <TableCell>单价</TableCell>
              <TableCell>天数</TableCell>
              <TableCell>金额</TableCell>
              <TableCell>运费</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rent.history.map((item) => (
              <TableRow key={shortId.generate()}>
                <TableCell>上期结存</TableCell>
                <TableCell/>
                <TableCell>{item.name}</TableCell>
                <TableCell/>
                <TableCell>{item.unit}</TableCell>
                <TableCell className="text-right">{numberFormat(item.count)}</TableCell>
                <TableCell className="text-right">{currencyFormat(item.unitPrice, 4)}</TableCell>
                <TableCell>{item.days}</TableCell>
                <TableCell className="text-right">{currencyFormat(item.price)}</TableCell>
                <TableCell/>
              </TableRow>
            ))}
            {rent.list.map((item) => (
              <TableRow key={shortId.generate()}>
                <TableCell>{dateFormat(item.outDate)}</TableCell>
                <TableCell>{item.inOut}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell className="text-right">{numberFormat(item.count)}</TableCell>
                <TableCell className="text-right">{currencyFormat(item.unitPrice, 4)}</TableCell>
                <TableCell>{item.days}</TableCell>
                <TableCell className="text-right">{currencyFormat(item.price)}</TableCell>
                <TableCell className="text-right">{currencyFormat(item.freight)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>,
        (rent.list.length > 0 || rent.history.length > 0) && <List key={1}>
          {rent.nameGroup.map(item => (
            <ListItem key={shortId.generate()}>{item.name}： {numberFormat(item.count)} {item.unit}</ListItem>
          ))}
          <ListItem key="price">金额：{numberFormat(rent.group[0].price)} 元</ListItem>
          <ListItem key="freight">运费：{numberFormat(rent.group[0].freight)} 元</ListItem>
        </List>,
      ]
    )
  }
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps)(SimpleSearchTable)
