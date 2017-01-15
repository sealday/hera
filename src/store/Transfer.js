/**
 * Created by seal on 11/01/2017.
 */

import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import InputForm from './TransferInputForm';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outDate: moment(),
      originalOrder: '',
      comments: '',
      carNumber: '',
      carFee: '',
      sortFee: '',
      other1Fee: '',
      other2Fee: '',
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
    });
  }

  handleChange = (e) => {
    if (e.target.name) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  }

  handleProjectChange = (e) => {
    this.props.onProjectChange(e)
  }

  handleDateChange = (date) => {
    this.setState({
      outDate: date
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit({
      ...this.state,
      fee: {
        car: this.state.carFee,
        sort: this.state.sortFee,
        other1: this.state.other1Fee,
        other2: this.state.other2Fee
      }
    })
  }

  render() {
    return (
      <div>
        <h2>创建{this.props.orderName}</h2>
        <div>
          <div className="form-horizontal">
            <div className="form-group">
              <label className="control-label col-md-1">项目部</label>
              <div className="col-md-3">
                <Select
                  name="project"
                  clearable={false}
                  placeholder="请选择项目"
                  value={this.props.stock}
                  options={this.props.projects.map(project => ({ value: project._id, label: project.company + project.name }))}
                  onChange={this.handleProjectChange}/>
              </div>
              <label className="control-label col-md-1">日期</label>
              <div className="col-md-3">
                <DatePicker selected={this.state.outDate} className="form-control" onChange={this.handleDateChange}/>
              </div>
              <label className="control-label col-md-1">原始单号</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="originalOrder" onChange={this.handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-1">车号</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="carNumber" onChange={this.handleChange} />
              </div>
              <label className="control-label col-md-1">运费</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="carFee" onChange={this.handleChange} />
              </div>
              <label className="control-label col-md-1">备注</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="comments" onChange={this.handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-1">整理费用</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="sortFee" onChange={this.handleChange} />
              </div>
              <label className="control-label col-md-1">其他费用1</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="other1Fee" onChange={this.handleChange} />
              </div>
              <label className="control-label col-md-1">其他费用2</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="other2Fee" onChange={this.handleChange} />
              </div>
            </div>
          </div>

          <InputForm onAdd={this.handleAdd} typeNameMap={this.props.typeNameMap} nameArticleMap={this.props.nameArticleMap} />
          <BootstrapTable
            data={this.state.entries}
            selectRow={{ mode: 'checkbox' }}
            options={{ noDataText: '还未添加数据', defaultSortName: '_id', defaultSortOrder: 'desc' }}
            cellEdit={{ mode: 'click', blurToSave: true }} deleteRow>
            <TableHeaderColumn dataField="_id" isKey={true} hidden={true}>id</TableHeaderColumn>
            <TableHeaderColumn dataField="type">类型</TableHeaderColumn>
            <TableHeaderColumn dataField="name">名称</TableHeaderColumn>
            <TableHeaderColumn dataField="size">规格</TableHeaderColumn>
            <TableHeaderColumn dataField="count">数量</TableHeaderColumn>
            <TableHeaderColumn dataField="total">小计</TableHeaderColumn>
          </BootstrapTable>
          <button className="btn btn-primary btn-block" onClick={this.handleSubmit}>创建</button>
        </div>
      </div>
    );
  }
}

export default Transfer
