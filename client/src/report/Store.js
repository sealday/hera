/**
 * Created by seal on 16/01/2017.
 */
import React, { Component } from 'react';
import { toFixedWithoutTrailingZero, calculateSize, makeKeyFromNameSize, filterOption, formatNumber } from '../utils'
import { connect } from 'react-redux'
import Select from 'react-select'
import { requestStore } from '../actions'
import { Map } from 'immutable'

class Store extends Component {
  constructor(props) {
    super(props)
    this.state = {
      records: [],
      project: props.store._id,
      showing: new Map()
    }
  }

  handleProjectChange = (project) => {
    this.setState({ project: project.value })
  }

  query = (e) => {
    e.preventDefault()
    if (this.state.project) {
      this.props.dispatch(requestStore(this.state.project))
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
    const articles = this.props.articles
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
        let exists = false
        if (key in inRecordMap) {
          value.in = inRecordMap[key]
          value.inTotal = toFixedWithoutTrailingZero(inRecordMap[key] * calculateSize(size))
          inTotal += Number(value.inTotal)
          exists = true
        }
        if (key in outRecordMap) {
          value.out = outRecordMap[key]
          value.outTotal = toFixedWithoutTrailingZero(outRecordMap[key] * calculateSize(size))
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
        let exists = false
        if (key in inRecordMap) {
          value.in = inRecordMap[key]
          value.inTotal = toFixedWithoutTrailingZero(inRecordMap[key] * calculateSize(size))
          inTotal += Number(value.inTotal)
          exists = true
        }
        if (key in outRecordMap) {
          value.out = outRecordMap[key]
          value.outTotal = toFixedWithoutTrailingZero(outRecordMap[key] * calculateSize(size))
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
      if (inTotal > 0 || outTotal > 0) {
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
    const { store } = this.props

    let recordsTable = []
    if (project && stocks.get(project)) {
      const records = this.getRecords(stocks.get(project))

      records.forEach((record, index) => {
        recordsTable.push(
          <tr key={index} onClick={e => {
            this.setState(state => ({
              showing: state.showing.update(record.total.name, showing => !showing)
            }))
          }}>
            <th>{record.total.type}</th>
            <th>{record.total.name}</th>
            <th>{record.total.size}</th>
            <th>{formatNumber(record.total.in)}</th>
            <th>{formatNumber(record.total.inTotal)}</th>
            <th>{formatNumber(record.total.out)}</th>
            <th>{formatNumber(record.total.outTotal)}</th>
            <th>{formatNumber(record.total.total)}</th>
          </tr>
        )

        const rowSpan = record.entries.length
        record.entries.forEach((record, recordIndex) => {
          let typeLine
          let nameLine
          if (recordIndex === 0) {
            typeLine = <td rowSpan={rowSpan}/>
            nameLine = <td rowSpan={rowSpan}/>
          }

          recordsTable.push(
            // 设计不显示时样式为 none
            <tr key={index + ',' + recordIndex} style={{display: this.state.showing.get(record.name) ? 'table-row' : 'none'}}>
              {typeLine}
              {nameLine}
              <td>{record.size}</td>
              <td>{formatNumber(record.in)}</td>
              <td>{formatNumber(record.inTotal)}</td>
              <td>{formatNumber(record.out)}</td>
              <td>{formatNumber(record.outTotal)}</td>
              <td>{formatNumber(record.total)}</td>
            </tr>
          )
        })
      })
    }

    return (
      <div>
        <h2 className="page-header">仓库实时查询</h2>
        <form className="form-horizontal" onSubmit={this.query}>
          <div className="form-group">
            <div className="col-md-10">
              <Select
                name="project"
                clearable={false}
                placeholder="选择要查询的仓库"
                value={this.state.project}
                options={[{
                  value: store._id,
                  label: store.company + store.name,
                  pinyin: store.pinyin
                }]}
                filterOption={filterOption}
                onChange={this.handleProjectChange}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary btn-block">查询</button>
            </div>
          </div>
        </form>
        <table className="table table-bordered table-hover">
          <thead>
          <tr>
            <th>类型</th>
            <th>名称</th>
            <th>规格</th>
            <th>入库数量</th>
            <th>入库小计</th>
            <th>出库数量</th>
            <th>出库小计</th>
            <th>小计</th>
          </tr>
          </thead>
          <tbody>
          {recordsTable}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.system.projects.toArray(),
  articles: state.system.articles.toArray(),
  stocks: state.store.stocks,
  store: state.system.store,
})

export default connect(mapStateToProps)(Store);