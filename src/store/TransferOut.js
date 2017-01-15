/**
 * Created by seal on 11/01/2017.
 */

import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import InputForm from './TransferInputForm';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { ajax, transformArticle } from '../utils';
import { connect } from 'react-redux'

class TransferOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inStock: '', // 调出进入的仓库
      outDate: moment(), //
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
    this.setState({
      inStock: e.value
    })
  }

  handleDateChange = (date) => {
    this.setState({
      outDate: date
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    ajax('/api/transfer', {
      data: JSON.stringify({
        entries: this.state.entries,
        inStock: this.state.inStock,
        outStock: this.props.outStock,
        originalOrder: this.state.originalOrder,
        comments: this.state.comments,
        carNumber: this.state.carNumber,
        outDate: this.state.outDate,
        fee: {
          car: this.state.carFee,
          sort: this.state.sortFee,
          other1: this.state.other1Fee,
          other2: this.state.other2Fee,
        }
      }),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      this.props.router.push(`transfer_order/${res.data.record._id}`)
    }).catch(err => {
      alert('出错了' + JSON.stringify(err));
    });
  }

  render() {
    return (
      <div>
        <h2>创建调拨出库单</h2>
        <div>
          <div className="form-horizontal">
            <div className="form-group">
              <label className="control-label col-md-1">项目部</label>
              <div className="col-md-3">
                <Select
                  name="project"
                  clearable={false}
                  placeholder="请选择项目"
                  value={this.state.inStock}
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

const mapStateToProps = state => {
  const props = transformArticle(state.articles)
  const bases = state.projects.filter(project => project.type == '基地仓库')
  const outStock = bases.length > 0 ? bases[0]._id : ''
  return {
    ...props,
    outStock,
    projects: state.projects
  }
}

export default connect(mapStateToProps)(TransferOut)
