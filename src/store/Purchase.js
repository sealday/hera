/**
 * Created by seal on 11/01/2017.
 */

import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import InputForm from './InputForm';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { ajax, transformArticle } from '../utils';
import { connect } from 'react-redux'

class Purchase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: '',
      date: moment(),
      originalOrder: '',
      comments: '',
      carNumber: '',
      vendor: '',
      entries : [],
    };
  }

  handleAdd = (entry) => {
    this.setState(prevState => {
      entry._id = new Date().getTime();
      prevState.entries.push(entry);
      return {
        entries: prevState.entries
      }
    })
  }

  handleChange = (e) => {
    if (e.target.name) {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }

  handleProjectChange = (e) => {
    this.setState({
      project: e.value
    })
  }

  handleDateChange = (date) => {
    this.setState({
      date: date
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.dir(this.state.date);
    ajax('/api/purchase', {
      data: JSON.stringify({
        entries: this.state.entries,
        inStock: this.state.project,
        originalOrder: this.state.originalOrder,
        comments: this.state.comments,
        carNumber: this.state.carNumber,
        date: this.state.date,
        vendor: this.state.vendor,
      }),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      alert(res.message);
    }).catch(err => {
      alert('出错了' + JSON.stringify(err));
    });
  }

  onDeleteRow = (rows) => {
    let entries = this.state.entries.filter(entry => rows.indexOf(entry._id) != -1)
    this.setState({entries})
  }

  render() {
    return (
      <div>
        <h2>创建采购单</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="hidden-content" hidden=""></div>
          <div className="form-horizontal">
            <div className="form-group">
              <label className="control-label col-md-1">项目部</label>
              <div className="col-md-3">
                <Select
                  name="project"
                  clearable={false}
                  placeholder="请选择项目"
                  value={this.state.project}
                  options={this.props.projects.map(project => ({ value: project._id, label: project.company + project.name }))}
                  onChange={this.handleProjectChange}/>
              </div>
              <label className="control-label col-md-1">对方单位</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="vendor" onChange={this.handleChange} />
              </div>
              <label className="control-label col-md-1">日期</label>
              <div className="col-md-3">
                <DatePicker selected={this.state.date} className="form-control" onChange={this.handleDateChange}/>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-1">原始单号</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="originalOrder" onChange={this.handleChange} />
              </div>
              <label className="control-label col-md-1">车号</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="carNumber" onChange={this.handleChange} />
              </div>
              <label className="control-label col-md-1">备注</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="comments" onChange={this.handleChange} />
              </div>
            </div>
          </div>

        <InputForm onAdd={this.handleAdd} typeNameMap={this.props.typeNameMap} nameArticleMap={this.props.nameArticleMap} />
        <BootstrapTable
          data={this.state.entries}
          selectRow={{ mode: 'checkbox' }}
          options={{ noDataText: '还未添加数据', defaultSortName: '_id', defaultSortOrder: 'desc', onDeleteRow: this.onDeleteRow }}
          cellEdit={{ mode: 'click', blurToSave: true }} deleteRow>
          <TableHeaderColumn dataField="_id" isKey={true} hidden={true}>id</TableHeaderColumn>
          <TableHeaderColumn dataField="type">类型</TableHeaderColumn>
          <TableHeaderColumn dataField="name">名称</TableHeaderColumn>
          <TableHeaderColumn dataField="size">规格</TableHeaderColumn>
          <TableHeaderColumn dataField="count">数量</TableHeaderColumn>
          <TableHeaderColumn dataField="total">小计</TableHeaderColumn>
          <TableHeaderColumn dataField="unit">单位</TableHeaderColumn>
          <TableHeaderColumn dataField="price">单价</TableHeaderColumn>
          <TableHeaderColumn dataField="sum">金额</TableHeaderColumn>
          <TableHeaderColumn dataField="freightCount">吨/趟</TableHeaderColumn>
          <TableHeaderColumn dataField="freightUnit">运费单位</TableHeaderColumn>
          <TableHeaderColumn dataField="freightPrice">运费单价</TableHeaderColumn>
          <TableHeaderColumn dataField="freight">运费</TableHeaderColumn>
          <TableHeaderColumn dataField="mixPrice">综合单价</TableHeaderColumn>
          <TableHeaderColumn dataField="mixSum">综合金额</TableHeaderColumn>
        </BootstrapTable>
        <button className="btn btn-primary btn-block">创建</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const props = transformArticle(state.articles)
  return {
    ...props,
    projects: state.projects
  }
}

export default connect(mapStateToProps)(Purchase)
