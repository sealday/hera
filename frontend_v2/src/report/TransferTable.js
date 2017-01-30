/**
 * Created by seal on 20/01/2017.
 */
import React, { Component } from 'react'
import { Link } from 'react-router'
import Select from 'react-select'
import moment from 'moment'
import DatePicker from 'react-datepicker';
import { getShortOrder } from '../utils'

class TransferTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '全部',
      project: '全部',
      size: '全部',
      startDate: moment('2017-01-01'),
      endDate: moment().startOf('day'),
      startCount: '',
      endCount: ''
    }
  }

  getName = (record) => {
    if (record.type === '采购') {
      return record.vendor
    } else if (record.type === '调拨') {
      const projects = this.props.projects
      const { company, name } = projects.get(record[this.props.stock])
      return company + name
    }
  }

  getOptions() {
    const records = this.props.records
    return [{ value: '全部', label: '全部'}].concat(records.map(record => ({
      value: record[this.props.stock],
      label: this.getName(record)
    })))
  }

  getNameOptions() {
    const articles = this.props.articles
    return [{ value: '全部', label: '全部' }].concat(articles.map(article => ({ value: article.name, label: article.name })))
  }

  getSizeOptions() {
    if (this.state.name === '全部' || !this.props.nameArticleMap[this.state.name]) {
      return [{ value: '全部', label: '全部' }]
    } else {
      return [{ value: '全部', label: '全部' }].concat(this.props.nameArticleMap[this.state.name].sizes.map(size => (
        {
          value: size,
          label: size
        }
      )))
    }
  }

  getRecords = () => {
    let records = this.props.records
    if (this.state.project !== '全部') {
      records = records.filter(record => record[this.props.stock] === this.state.project)
    }
    records = records.filter(record => this.state.startDate < moment(record.outDate) && moment(this.state.endDate).add(1, 'day') > moment(record.outDate))
    if (this.state.name !== '全部') {
      records = records.filter(record => record.entries.some(entry => this.state.name === entry.name))
    }
    if (this.state.size !== '全部') {
      records = records.filter(record => record.entries.some(entry => this.state.size === entry.size))
    }
    if (this.state.endCount !== '') {
      records = records.filter(record => record.entries.some(entry => entry.count <= this.state.endCount))
    }
    if (this.state.startCount !== '') {
      records = records.filter(record => record.entries.some(entry => this.state.startCount <= entry.count))
    }

    let printRecords = []
    records.forEach(record => {
      printRecords.push(record)
      record.entries.forEach(entry => {
        printRecords.push(entry)
      })
    })

    return printRecords
  }

  handleProjectChange = (project) => {
    this.setState({
      project: project.value
    })
  }

  handleNameChange = (name) => {
    this.setState({
      name: name.value,
      size: '全部'
    })
  }

  handleSizeChange = (size) => {
    this.setState({
      size: size.value,
    })
  }

  handleChangeStart = (startDate) => {
    this.setState({
      startDate
    })
  }

  handleChangeEnd = (endDate) => {
    this.setState({
      endDate
    })
  }

  handleStartCountChange = (e) => {
    this.setState({
      startCount: e.target.value
    })
  }

  handleEndCountChange = (e) => {
    this.setState({
      endCount: e.target.value
    })
  }

  render() {
    let name
    if (this.props.stock === 'inStock') {
      name = '发往'
    } else if (this.props.stock === 'outStock') {
      name = '来自'
    }
    return (
      <div>
        <div className="form-horizontal">
          <div className="form-group">
            <label className="control-label col-md-1">{name}</label>
            <div className="col-md-2">
              <Select
                name="project"
                clearable={false}
                placeholder=""
                value={this.state.project}
                options={this.getOptions()}
                onChange={this.handleProjectChange}
              />
            </div>
            <label className="control-label col-md-1">开始日期</label>
            <div className="col-md-2">
              <DatePicker
                className="form-control"
                selected={this.state.startDate}
                selectsStart  startDate={this.state.startDate}
                endDate={this.state.endDate}
                onChange={this.handleChangeStart} />
            </div>
            <label className="control-label col-md-1">结束日期</label>
            <div className="col-md-2">
              <DatePicker
                className="form-control"
                selected={this.state.endDate}
                selectsEnd  startDate={this.state.startDate}
                endDate={this.state.endDate}
                onChange={this.handleChangeEnd} />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-md-1">名称</label>
            <div className="col-md-1">
              <Select
                name="name"
                clearable={false}
                placeholder=""
                value={this.state.name}
                options={this.getNameOptions()}
                onChange={this.handleNameChange}
              />
            </div>
            <label className="control-label col-md-1">规格</label>
            <div className="col-md-1">
              <Select
                name="size"
                clearable={false}
                placeholder=""
                value={this.state.size}
                options={this.getSizeOptions()}
                onChange={this.handleSizeChange}
              />
            </div>
            <label className="control-label col-md-1">数量范围</label>
            <div className="col-md-1">
              <input className="form-control" value={this.state.startCount} onChange={this.handleStartCountChange}/>
            </div>
            <div className="col-md-1">
              <input className="form-control" value={this.state.endCount} onChange={this.handleEndCountChange}/>
            </div>
          </div>
        </div>
        <table className="table table-bordered">
          <thead>
          <tr>
            <th className="text-center">类型</th>
            <th className="text-center">单号</th>
            <th className="text-center">时间</th>
            <th className="text-center">{name}</th>
            <th className="text-center" colSpan="3">内容</th>
            <th className="text-center">状态</th>
            <th className="text-center">制单人</th>
            <th className="text-center">制单时间</th>
            <th className="text-center">详情</th>
          </tr>
          </thead>
          <tbody>
          {this.getRecords().map((record, index) => {
            if (record.entries) {
              const rowSpan = record.entries.length + 1
              return (
                <tr key={index}>
                  <td rowSpan={rowSpan}>{record.type}</td>
                  <td rowSpan={rowSpan}>{getShortOrder(record._id)}</td>
                  <td rowSpan={rowSpan}>{moment(record.outDate).format('YYYY-MM-DD')}</td>
                  <td rowSpan={rowSpan}>{this.getName(record)}</td>
                  <th>名称</th>
                  <th>规格</th>
                  <th>数量</th>
                  <td rowSpan={rowSpan}>{record.status}</td>
                  <td rowSpan={rowSpan}>{record.username}</td>
                  <td rowSpan={rowSpan}>{moment(record.updatedAt).format('YYYY-MM-DD')}</td>
                  <td rowSpan={rowSpan}>
                    <Link onClick={() => {
                      this.props.dispatch({ type: 'UPDATE_RECORDS_CACHE', record })
                    }} to={ `/transfer/${record._id}`}>详情</Link>
                    <br/>
                    <Link onClick={() => {
                      this.props.dispatch({ type: 'UPDATE_RECORDS_CACHE', record })
                    }} to={ `/transport/${record._id}`}>运输单</Link>
                  </td>
                </tr>
              )
            } else {
              return (
                <tr key={index}>
                  <td>{record.name}</td>
                  <td>{record.size}</td>
                  <td>{record.count}</td>
                </tr>
              )
            }
          })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TransferTable
