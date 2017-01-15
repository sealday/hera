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

class TransferIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeNameMap: {},
      nameArticleMap: {},
      projects: [],

      project: '',
      date: moment(),
      originalOrder: '',
      comments: '',
      carNumber: '',
      carFee: '',
      sortFee: '',
      other1Fee: '',
      other2Fee: '',
      entries : [],
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.store = window.store;
    this.unsubscribes = [];
  }

  handleAdd(entry) {
    this.setState(prevState => {
      entry._id = new Date().getTime();
      prevState.entries.push(entry);
      return {
        entries: prevState.entries
      }
    });
  }

  componentDidMount() {
    this.unsubscribes[0] = this.store.subscribe(() => {
      let articles = this.store.getState().articles;
      this.transformArticle(articles);
    });
    this.unsubscribes[1] = this.store.subscribe(() => {
      let projects = this.store.getState().projects;
      this.setState({projects});
    });

    let projects = this.store.getState().projects;
    this.setState({projects});
    this.transformArticle(this.store.getState().articles);
  }

  componentWillUnmount() {
    this.unsubscribes[0]();
    this.unsubscribes[1]();
  }

  transformArticle(articles) {
    let typeNameMap = {
      租赁类: [],
      消耗类: [],
      工具类: []
    };
    let nameArticleMap = {};
    articles.forEach(article => {
      typeNameMap[article.type].push(article.name);
      nameArticleMap[article.name] = article;
    });

    this.setState({
      typeNameMap,
      nameArticleMap
    });
  }

  handleChange(e) {
    if (e.target.name) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  }

  handleProjectChange(e) {
    this.setState({
      project: e.value
    })
  }

  handleDateChange(date) {
    this.setState({
      date: date
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.dir(this.state.date);
    ajax('/api/transfer_in', {
      data: JSON.stringify({
        entries: this.state.entries,
        project: this.state.project,
        originalOrder: this.state.originalOrder,
        comments: this.state.comments,
        carNumber: this.state.carNumber,
        date: this.state.date,
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
      alert(res);
    }).catch(err => {
      alert('出错了' + JSON.stringify(err));
    });
  }

  render() {
    return (
      <div>
        <h2>创建调拨入库单</h2>
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
                  options={this.state.projects.map(project => ({ value: project._id, label: project.company + project.name }))}
                  onChange={this.handleProjectChange}/>
              </div>
              <label className="control-label col-md-1">日期</label>
              <div className="col-md-3">
                <DatePicker selected={this.state.date} className="form-control" onChange={this.handleDateChange}/>
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

          <InputForm onAdd={this.handleAdd} typeNameMap={this.state.typeNameMap} nameArticleMap={this.state.nameArticleMap} />
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

export default connect(mapStateToProps)(TransferIn)
