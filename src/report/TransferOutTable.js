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

class TransferOutTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      project: '',
      startDate: moment('2017-01-01'),
      endDate: moment(moment().format('YYYY-MM-DD'))
    }
  }

  componentDidMount() {
    this.props.dispatch({ type: 'REQUEST_OUT_RECORDS', status: 'NEED_REQUEST' })
  }


  getOptions() {
    const projectIdMap = this.props.projectIdMap
    const records = this.props.records
    return records.map(record => ({
      value: record.inStock,
      label: projectIdMap[record.inStock].company + projectIdMap[record.inStock].name
    })).concat({value: '', label: '全部'})
  }

  getRecords = () => {
    return this.props.records.filter(record => {
      if (this.state.project) {
        return record.inStock == this.state.project
      } else {
        return true
      }
    }).filter(record => {
      return this.state.startDate < moment(record.outDate) && moment(this.state.endDate).add(1, 'day') > moment(record.outDate)
    })
  }

  handleProjectChange = (project) => {
    this.setState({
      project: project.value
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
        </div>
        {alert}
        <table className="table">
          <thead>
          <tr>
            <th>类型</th>
            <th>时间</th>
            <th>发往</th>
            <th>内容预览</th>
            <th>状态</th>
            <th>制单人</th>
            <th>制单时间</th>
            <th>详情</th>
          </tr>
          </thead>
          <tbody>
          {this.getRecords().map(record => (
            <tr key={record._id}>
              <td>{record.type}</td>
              <td>{moment(record.outDate).format('YYYY-MM-DD')}</td>
              <td>{this.props.projectIdMap[record.inStock].company + this.props.projectIdMap[record.inStock].name}</td>
              <td>{record.entries.map(entry => (
                <p key={shortid.generate()}>
                  <span style={{marginRight: '1em'}}>{entry.name}</span>
                  <span style={{marginRight: '1em'}}>{entry.size}</span>
                  <span>{entry.count}</span>
                </p>
              ))}</td>
              <td>{record.status}</td>
              <td>{record.username}</td>
              <td>{moment(record.updatedAt).format('YYYY-MM-DD')}</td>
              <td><Link onClick={() => {
                this.props.dispatch({ type: 'UPDATE_RECORDS_CACHE', record })
              }} to={ `transfer_order/${record._id}`}>进入详情</Link></td>
            </tr>
          ))}
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
    status: state.outRecordsRequestStatus
  }
}


export default connect(mapStateToProps)(TransferOutTable)
