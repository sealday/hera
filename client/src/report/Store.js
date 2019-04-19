import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Map } from 'immutable'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core'

import {
  toFixedWithoutTrailingZero,
  makeKeyFromNameSize,
  formatNumber,
  oldProductStructure,
  getScale,
} from '../utils'
import { requestStore } from '../actions'
import StoreForm from './StoreForm'

class Store extends Component {
  constructor(props) {
    super(props)
    this.state = {
      records: [],
      project: props.store._id,
      startDate: moment().startOf('year'),
      endDate: moment().endOf('year').startOf('day'),
      showing: new Map()
    }
  }

  handleProjectChange = (project) => {
    this.setState({ project: project.value })
  }

  query = data => {
    if (data.project) {
      this.props.dispatch(requestStore({
        project: data.project,
        startDate: data.startDate,
        endDate: moment(data.endDate).add(1, 'day'),
      }))
      this.setState({
        showing: new Map() // 重置状态显示
      })
    }
  }

  getRecords = (stock) => {
    const inRecords = stock.inRecords
    const outRecords = stock.outRecords
    let inRecordMap = {}
    inRecords.forEach(record => {
      inRecordMap[makeKeyFromNameSize(record._id.name, record._id.size)] = record.sum
    })
    let outRecordMap = {}
    outRecords.forEach(record => {
      outRecordMap[makeKeyFromNameSize(record._id.name, record._id.size)] = record.sum
    })

    let records = [] // [{ total, entries }]
    const articles = oldProductStructure(this.props.articles.toArray())
    articles.forEach(article => {
      // 算每一项
      let inTotal = 0
      let outTotal = 0
      let total = 0

      let record = {
        total: null,
        entries: []
      }

      // 如果有规格数据的话
      article.sizes.forEach(size => {
        const key = makeKeyFromNameSize(article.name, size)
        let value = {}
        value.delta = 0;
        let exists = false
        if (key in inRecordMap) {
          value.in = inRecordMap[key]
          value.delta = value.in;
          value.inTotal = toFixedWithoutTrailingZero(inRecordMap[key] * getScale(this.props.products[key]))
          inTotal += Number(value.inTotal)
          exists = true
        }
        if (key in outRecordMap) {
          value.out = outRecordMap[key]
          value.delta -= value.out;
          value.outTotal = toFixedWithoutTrailingZero(outRecordMap[key] * getScale(this.props.products[key]))
          outTotal += Number(value.outTotal)
          exists = true
        }

        if (exists) {
          value.total = toFixedWithoutTrailingZero((value.inTotal || 0) - (value.outTotal || 0))
          record.entries.push({
            type: article.type,
            name: article.name,
            size: size,
            ...value
          })
        }
      })

      // 如果没有规格数据，比如电脑
      if (article.sizes.length === 0) {
        const size = undefined
        const key = makeKeyFromNameSize(article.name, size)
        let value = {}
        value.delta = 0;
        let exists = false
        if (key in inRecordMap) {
          value.in = inRecordMap[key]
          value.delta += value.in
          value.inTotal = toFixedWithoutTrailingZero(inRecordMap[key] * getScale(this.props.products[key]))
          inTotal += Number(value.inTotal)
          exists = true
        }
        if (key in outRecordMap) {
          value.out = outRecordMap[key]
          value.delta -= value.out
          value.outTotal = toFixedWithoutTrailingZero(outRecordMap[key] * getScale(this.props.products[key]))
          outTotal += Number(value.outTotal)
          exists = true
        }

        if (exists) {
          value.total = toFixedWithoutTrailingZero((value.inTotal || 0) - (value.outTotal || 0))
          record.entries.push({
            type: article.type,
            name: article.name,
            size: size,
            ...value
          })
        }
      }

      // 计算合计
      if (inTotal !== 0 || outTotal !== 0) {
        total = toFixedWithoutTrailingZero(inTotal - outTotal)
        record.total = {
          type: article.type,
          name: article.name,
          inTotal: toFixedWithoutTrailingZero(inTotal),
          outTotal: toFixedWithoutTrailingZero(outTotal),
          total
        }

        records.push(record)
      }
    })
    return records
  }

  render() {
    let project = this.state.project
    let stocks = this.props.stocks

    let recordsTable = []
    if (project && stocks.get(project)) {
      const records = this.getRecords(stocks.get(project))

      records.forEach((record, index) => {
        recordsTable.push(
          <TableRow key={index} onClick={e => {
            this.setState(state => ({
              showing: state.showing.update(record.total.name, showing => !showing)
            }))
          }}>
            <TableCell>{record.total.type}</TableCell>
            <TableCell>{record.total.name}</TableCell>
            <TableCell>{record.total.size}</TableCell>
            <TableCell>{formatNumber(record.total.in)}</TableCell>
            <TableCell>{formatNumber(record.total.out)}</TableCell>
            <TableCell/>
            <TableCell>{formatNumber(record.total.total)}</TableCell>
          </TableRow>
        )

        const rowSpan = record.entries.length
        record.entries.forEach((record, recordIndex) => {
          let typeLine
          let nameLine
          if (recordIndex === 0) {
            typeLine = <TableCell rowSpan={rowSpan}/>
            nameLine = <TableCell rowSpan={rowSpan}/>
          }

          recordsTable.push(
            // 设计不显示时样式为 none
            <TableRow key={index + ',' + recordIndex} style={{display: this.state.showing.get(record.name) ? 'table-row' : 'none'}}>
              {typeLine}
              {nameLine}
              <TableCell>{record.size}</TableCell>
              <TableCell>{formatNumber(record.in)}</TableCell>
              <TableCell>{formatNumber(record.out)}</TableCell>
              <TableCell>{formatNumber(record.delta)}</TableCell>
              <TableCell>{formatNumber(record.total)}</TableCell>
            </TableRow>
          )
        })
      })
    }

    return (
      <>
        <Card>
          <CardHeader
            title="库存查询"
            action={<>
              <Button onClick={() => this.form.reset()}>重置</Button>
              <Button color="primary" onClick={() => this.form.submit()}>查询</Button>
            </>}
          />
          <CardContent>
            <StoreForm ref={form => this.form = form} onSubmit={this.query}/>
          </CardContent>
        </Card>
        <Card style={{ marginTop: '16px' }}>
          <CardContent>
            <Table padding="dense">
              <TableHead>
                <TableRow>
                  <TableCell>类型</TableCell>
                  <TableCell>名称</TableCell>
                  <TableCell>规格</TableCell>
                  <TableCell>入库数量</TableCell>
                  <TableCell>出库数量</TableCell>
                  <TableCell>结存数量</TableCell>
                  <TableCell>小计</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recordsTable}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
    )
  }
}

const mapStateToProps = state => ({
  articles: state.system.articles,
  products: state.system.products,
  stocks: state.store.stocks,
  store: state.system.store,
})

export default connect(mapStateToProps)(Store);