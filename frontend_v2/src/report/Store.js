/**
 * Created by seal on 16/01/2017.
 */
import React, { Component } from 'react';
import { toFixedWithoutTrailingZero, calculateSize, makeKeyFromNameSize } from '../utils'
import { connect } from 'react-redux'
import Select from 'react-select'
import { requestStore } from '../actions'

class Store extends Component {
  constructor(props) {
    super(props)
    this.state = {
      records: [],
      project: ''
    }
  }

  handleProjectChange = (project) => {
    this.setState({ project: project })
  }

  handleClick = () => {
    if (this.state.project) {
      this.props.dispatch(requestStore(this.state.project.value))
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

    let records = []
    const articles = this.props.articles
    articles.forEach(article => {
      // 算每一项
      let inTotal = 0
      let outTotal = 0
      let total = 0
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
          records.push({
            type: article.type,
            name: article.name,
            size: size,
            ...value
          })
        }
      })
      // 计算合计
      if (inTotal > 0 || outTotal > 0) {
        total = toFixedWithoutTrailingZero(inTotal - outTotal)
        records.push({
          type: article.type,
          name: article.name,
          inTotal,
          outTotal,
          total
        })
      }

    })
    return records
  }

  render() {
    let project = this.state.project.value
    let stocks = this.props.stocks
    return (
      <div>
        <h2>仓库实时查询</h2>
        <div className="row">
          <div className="col-md-10">
            <Select
              name="project"
              clearable={false}
              placeholder="选择要查询的仓库"
              value={this.state.project}
              options={this.props.projects.map(project => ({ value: project._id, label: project.company + project.name }))}
              onChange={this.handleProjectChange}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary btn-block" onClick={this.handleClick}>查询</button>
          </div>
        </div>
        <table className="table">
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
          {project && stocks.get(project) && this.getRecords(stocks.get(project)).map(record => (
            <tr>
              <td>{record.type}</td>
              <td>{record.name}</td>
              <td>{record.size}</td>
              <td>{record.in}</td>
              <td>{record.inTotal}</td>
              <td>{record.out}</td>
              <td>{record.outTotal}</td>
              <td>{record.total}</td>
            </tr>
          ))}
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
})

export default connect(mapStateToProps)(Store);