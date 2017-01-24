/**
 * Created by seal on 12/01/2017.
 */

import React, { Component } from 'react';
import Select, { Creatable } from 'react-select';
import { calculateSize, toFixedWithoutTrailingZero } from '../utils';

export default class TransferInputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '租赁类',
      name: '',
      size: '',
      count: '',
      total: '',
      unit: '',
      price: '',
      sum: '',
      freightChecked: false,
      freightCount: 0,
      freightUnit: '吨',
      freightPrice: 4000,
      freight: 0,
      mixPrice: 0,
      mixSum: 0
    };
  }

  static propTypes = {
    onAdd: React.PropTypes.func.isRequired,
    nameArticleMap: React.PropTypes.object.isRequired,
    typeNameMap: React.PropTypes.object.isRequired
  };

  handleChange = (e) => {
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
            count: '',
          });
          break;
      }
    }
  }

  handleNameChange = (name) => {
    this.setState(prevState => ({
      name: name.value,
      size: '',
      count: '',
    }));
  }

  handleSizeChange = (size) => {
    this.setState(prevState => ({
      size: size.value,
      count: '',
    }));
  }

  handleSubmit = (e) => {
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

      this.props.onAdd({...state});
      state.size = ''
      state.count = ''
      return state;
    });

    this.refs.size.focus()

  }

  getNames(type) {
    return this.props.typeNameMap[type] || [];
  }

  getSizes(name) {
    const article = this.props.nameArticleMap[name];
    return article ? article.sizes : [];
  }

  getUnit(name) {
    const article = this.props.nameArticleMap[name];
    return article ? article.unit : '';
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
              <Select
                name="name"
                ref="name"
                clearable={false}
                placeholder=""
                value={this.state.name}
                options={this.getNames(this.state.type).map(name => ({ value: name, label: name }))}
                onChange={this.handleNameChange}
              />
          </div>
          <div className="form-group">
            <label className="control-label">规格</label>
            <Select
              name="size"
              ref="size"
              onInputKeyDown={event => {
                // 退格 8 TODO 考虑怎么将退格键结合上去
                if (event.keyCode == 37) { // 方向左键
                  this.refs.name.focus()
                }
              }}
              clearable={false}
              placeholder=""
              value={this.state.size}
              options={this.getSizes(this.state.name).map(size => ({ value: size, label: size}))}
              onChange={this.handleSizeChange}
            />
          </div>
          <div className="form-group">
            <label className="control-label">数量</label>
            <input
              onKeyDown={event => {
                if (event.keyCode == 37) { // 方向左键
                  this.refs.size.focus()
                }
              }}
              type="text" name="count" autoComplete="off" className="form-control" value={this.state.count} onChange={this.handleChange}/>
          </div>
          <div className="form-group">
            <button className="btn btn-primary">添加</button>
          </div>
        </fieldset>
      </form>
    );
  }
}
