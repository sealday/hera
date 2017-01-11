/**
 * Created by seal on 11/01/2017.
 */

import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Autocomplete from 'react-autocomplete';
import Select from 'react-select';

class Purchase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries       : [],
      typeNameMap   : {},
      nameArticleMap: {},
      project: 'one'
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleAdd(entry) {
    this.setState(prevState => {
      entry.id = new Date().getTime();
      prevState.entries.push(entry);
      return {
        entries: prevState.entries
      }
    });
  }

  componentDidMount() {
    fetch('/api/article').then(res => res.json())
      .then(articles => {
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
      })
      .catch(err => {
        alert('出错了：' + JSON.stringify(err));
      });
  }

  componentWillUnmount() {

  }

  handleChange(e) {
    this.setState({
      project: e.value
    })
  }

  render() {
    return (
      <div>
        <ol className="breadcrumb">
          <li><a href="#">主页</a></li>
          <li><a href="#">a项目</a></li>
          <li><a href="#">采购列表</a></li>
          <li className="active">采购单填写</li>
        </ol>
        <h2>a 创建采购单</h2>
        <form action="../purchase" method="post" id="order-create-form">
          <div className="hidden-content" hidden=""></div>
          <div className="form-horizontal">
            <div className="form-group">
              <label className="control-label col-md-1">工程项目</label>
              <div className="col-md-3">
                {/*<select className="form-control" name="project" id="project">*/}
                  {/*<option value="586e30a7a86efadc0fdc3d99">aa</option>*/}
                  {/*<option value="586e30fea86efadc0fdc3e79">bbbb</option>*/}
                  {/*<option value="58710c2e2270aefd76044d3f">sdfasdfsdfasdf</option>*/}
                {/*</select>*/}
                <Select name="project" value={this.state.project} options={[{ value: "one", label: "one"}, { value: "two", label: "two"}]} onChange={this.handleChange}/>
              </div>
              <label className="control-label col-md-1">对方单位</label>
              <div className="col-md-3">
                <input className="form-control" type="text" id="vendor" name="vendor" />
              </div>
              <label className="control-label col-md-1">日期</label>
              <div className="col-md-3">
                <input className="form-control" type="date" id="date" name="date" />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-1">原始单号</label>
              <div className="col-md-3">
                <input className="form-control" type="text" id="originalOrder" name="originalOrder" />
              </div>
              <label className="control-label col-md-1">车号</label>
              <div className="col-md-3">
                <input className="form-control" type="text" id="carNumber" name="carNumber" />
              </div>
              <label className="control-label col-md-1">备注</label>
              <div className="col-md-3">
                <input className="form-control" type="text" id="comments" name="comments" />
              </div>
            </div>
          </div>
        </form>

        <InputForm onAdd={this.handleAdd} typeNameMap={this.state.typeNameMap} nameArticleMap={this.state.nameArticleMap} />
        <BootstrapTable
          data={this.state.entries}
          selectRow={{ mode: 'checkbox' }}
          options={{ noDataText: '还未添加数据', defaultSortName: 'id', defaultSortOrder: 'desc' }}
          cellEdit={{ mode: 'click', blurToSave: true }} deleteRow>
          <TableHeaderColumn dataField="id" isKey={true} hidden={true}>id</TableHeaderColumn>
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
        <button className="btn btn-primary btn-block" id="order-create-button">创建</button>
      </div>
    );
  }
}

class InputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '租赁类',
      name: '',
      size: '',
      count: 0,
      total: '',
      unit: '',
      price: 0,
      sum: 0,
      freightChecked: false,
      freightCount: 0,
      freightUnit: '吨',
      freightPrice: 4000,
      freight: 0,
      mixPrice: 0,
      mixSum: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static propTypes = {
    onAdd: React.PropTypes.func.isRequired,
    nameArticleMap: React.PropTypes.object.isRequired,
    typeNameMap: React.PropTypes.object.isRequired
  };

  handleChange(e) {
    if (e.target.name) {
      if (e.target.type == 'checkbox') {
        this.setState({
          [e.target.name]: e.target.checked
        });
      } else {
        this.setState({
          [e.target.name]: e.target.value
        });
      }

      switch (e.target.name) {
        case 'type':
          this.setState({
            name: '',
            size: '',
            count: 0
          });
          break;
        case 'name':
          this.setState({
            size: '',
            count: 0
          });
          break;
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState(prevState => {
      let state = prevState;
      state.total = toFixedWithoutTrailingZero(calculateSize(prevState.size) * prevState.count);
      state.sum = toFixedWithoutTrailingZero(prevState.price * state.total);
      if (prevState.freightChecked) {
        state.freight = toFixedWithoutTrailingZero(prevState.freightCount * prevState.freightCount);
      }
      state.mixSum = toFixedWithoutTrailingZero(state.freight + state.sum);
      state.mixPrice = toFixedWithoutTrailingZero(state.mixSum / state.total);

      this.props.onAdd(state);
      return state;
    });
  }

  getNames(type) {
    return this.props.typeNameMap[type] || [];
  }

  getSizes(name) {
    const article = this.props.nameArticleMap[name];
    return article ? article.sizes : [];
  }

  render() {
    return (
      <form className="form-inline" onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>新增条目</legend>
          <div className="form-group">
            <label className="control-label">类型</label>
            <select name="type" className="form-control" value={this.state.type} onChange={this.handleChange}>
              <option>租赁类</option>
              <option>耗损类</option>
              <option>工具类</option>
            </select>
          </div>
          <div className="form-group">
            <label className="control-label">名称</label>
            <Autocomplete
              value={this.state.name}
              inputProps={{ name: "name", className: 'form-control'}}
              items={this.getNames(this.state.type)}
              getItemValue={item => item}
              shouldItemRender={(name, value) => name.indexOf(value) !== -1}
              onChange={this.handleChange}
              onSelect={name => this.setState({ name })}
              renderItem={(name, isSelected) => (
                <div
                  key={name}
                  style={ isSelected ? styles.highlightedItem : styles.item }
                >{name}</div>
              )}
            />
          </div>
          {/*shouldItemRender={(size, value) => size.indexOf(value) !== -1}*/}
          <div className="form-group">
            <label className="control-label">规格</label>
            <Autocomplete
              value={this.state.size}
              inputProps={{ name: "size", className: 'form-control'}}
              items={this.getSizes(this.state.name)}
              getItemValue={item => item}
              onChange={this.handleChange}
              onSelect={size => this.setState({ size })}
              renderItem={(size, isSelected) => (
                <div
                  key={size}
                  style={ isSelected ? styles.highlightedItem : styles.item }
                >{size}</div>
              )}
            />
          </div>
          <div className="form-group">
            <label className="control-label">数量</label>
            <input type="text" name="count" autoComplete="off" className="form-control" value={this.state.count} onChange={this.handleChange}/>
          </div>
          <div className="form-group">
            <label className="control-label">单位</label>
            <input type="text" name="unit" autoComplete="off" className="form-control" value={this.state.unit} onChange={this.handleChange}/>
          </div>
          <div className="form-group">
            <label className="control-label">单价</label>
            <input type="text" name="price" autoComplete="off" className="form-control" value={this.state.price} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label className="control-label">
              是否有运费 <input type="checkbox" name="freightChecked" checked={this.state.freightChecked} onChange={this.handleChange} />
            </label>
          </div>
          <div className="form-group" style={{display: this.state.freightChecked? 'inline-block' : 'none'}}>
            <input name="freightCount" className="form-control" value={this.state.freightCount} onChange={this.handleChange} />
            <select name="freightUnit" className="form-control" value={this.state.freightUnit} onChange={this.handleChange}>
              <option value="吨">吨</option>
              <option value="趟">趟</option>
            </select>
          </div>
          <div className="form-group" style={{display: this.state.freightChecked? 'inline-block' : 'none'}}>
            <label className="control-label">运费单价</label>
            <input type="text" name="freightPrice" autoComplete="off" required="required" className="form-control" value={this.state.freightPrice} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <button className="btn btn-primary">添加</button>
          </div>
        </fieldset>
      </form>
    );
  }
}

function calculateSize(size) {
  let sizes = size.split(';');
  if (isNaN(sizes[sizes.length - 1])) {
    return 1;
  } else {
    return Number(sizes[sizes.length - 1]);
  }
}

// 保留两位数，去除多余的零
function toFixedWithoutTrailingZero(num) {
  return Number(Number(num).toFixed(2)).toString();
}

let styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default'
  },

  highlightedItem: {
    color: 'white',
    background: 'hsl(200, 50%, 50%)',
    padding: '2px 6px',
    cursor: 'default'
  },

  menu: {
    border: 'solid 1px #ccc'
  }
};

export default Purchase;