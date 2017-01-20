/**
 * Created by seal on 15/01/2017.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import shortid from 'shortid'
import Select from 'react-select'
import moment from 'moment'
import DatePicker from 'react-datepicker';
import { transformArticle } from '../utils'

class TransferOutTable extends Component {
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

  componentDidMount() {
    this.props.dispatch({ type: 'REQUEST_OUT_RECORDS', status: 'NEED_REQUEST' })
  }


  getOptions() {
    const projectIdMap = this.props.projectIdMap
    const records = this.props.records
    return [{ value: '全部', label: '全部'}].concat(records.map(record => ({
      value: record.inStock,
      label: projectIdMap[record.inStock].company + projectIdMap[record.inStock].name
    })))
  }

  getNameOptions() {
    return [{ value: '全部', label: '全部' }].concat(this.props.articles.map(article => ({ value: article.name, label: article.name })))
  }

  getSizeOptions() {
    if (this.state.name == '全部' || !this.props.nameArticleMap[this.state.name]) {
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
    const records = this.props.records.filter(record => {
      if (this.state.project == '全部') {
        return true
      } else {
        return record.inStock == this.state.project
      }
    }).filter(record => {
      return this.state.startDate < moment(record.outDate) && moment(this.state.endDate).add(1, 'day') > moment(record.outDate)
    }).filter(record => {
      if (this.state.name == '全部') {
        return true
      } else {
        return record.entries.some(entry => this.state.name == entry.name)
      }
    }).filter(record => {
      if (this.state.size == '全部') {
        return true
      } else {
        return record.entries.some(entry => this.state.size == entry.size)
      }
    }).filter(record => {
      if (this.state.endCount != '') {
        return record.entries.some(entry => entry.count <= this.state.endCount)
      } else {
        return true
      }
    }).filter(record => {
      if (this.state.startCount != '') {
        return record.entries.some(entry => this.state.startCount <= entry.count )
      } else {
        return true
      }
    })

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
    let alert = false

    if (this.props.status == 'REQUESTING') {
      alert = (
        <div className="alert alert-info">
          正在请求出库单列表，请稍后
        </div>
      )
    }

    return (
      <div>
        <div className="form-horizontal">
          <div className="form-group">
            <label className="control-label col-md-1">发往</label>
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
        {alert}
        <table className="table table-bordered">
          <thead>
          <tr>
            <th className="text-center">类型</th>
            <th className="text-center">时间</th>
            <th className="text-center">发往</th>
            <th className="text-center" colSpan="3">内容</th>
            <th className="text-center">状态</th>
            <th className="text-center">制单人</th>
            <th className="text-center">制单时间</th>
            <th className="text-center">详情</th>
          </tr>
          </thead>
          <tbody>
          {this.getRecords().map(record => {
            if (record.entries) {
              const rowSpan = record.entries.length + 1
              return (
                <tr key={record._id}>
                  <td rowSpan={rowSpan}>{record.type}</td>
                  <td rowSpan={rowSpan}>{moment(record.outDate).format('YYYY-MM-DD')}</td>
                  <td rowSpan={rowSpan}>{this.props.projectIdMap[record.inStock].company + this.props.projectIdMap[record.inStock].name}</td>
                  <th>名称</th>
                  <th>规格</th>
                  <th>数量</th>
                  <td rowSpan={rowSpan}>{record.status}</td>
                  <td rowSpan={rowSpan}>{record.username}</td>
                  <td rowSpan={rowSpan}>{moment(record.updatedAt).format('YYYY-MM-DD')}</td>
                  <td rowSpan={rowSpan}>
                    <Link onClick={() => {
                      this.props.dispatch({ type: 'UPDATE_RECORDS_CACHE', record })
                    }} to={ `transfer_order/${record._id}`}>进入详情</Link>
                    <br/>
                    <Link onClick={() => {
                      this.props.dispatch({ type: 'UPDATE_RECORDS_CACHE', record })
                    }} to={ `transfer_order/${record._id}`}>查看关联运输单</Link>
                  </td>
                </tr>
              )
            } else {
              return (
                <tr key={record._id}>
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

const mapStateToProps = state => {
  const bases = state.projects.filter(project => project.type == '基地仓库')
  const outStock = bases.length > 0 ? bases[0]._id : ''
  return {
    outStock,
    records: state.outRecords,
    projects: state.projects,
    projectIdMap: state.projectIdMap,
    status: state.outRecordsRequestStatus,
    articles: state.articles,
    ...transformArticle(state.articles)
  }
}


export default connect(mapStateToProps)(TransferOutTable)
