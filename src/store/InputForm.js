/**
 * Created by seal on 12/01/2017.
 */

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';

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
            count: 0,
          });
          break;
        case 'name':
          this.setState(prevState => ({
            size: '',
            count: 0,
          }));
          break;
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

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
            <Autocomplete
              value={this.state.name}
              inputProps={{ name: "name", className: 'form-control'}}
              items={this.getNames(this.state.type)}
              getItemValue={item => item}
              shouldItemRender={(name, value) => name.indexOf(value) !== -1}
              onChange={this.handleChange}
              onSelect={name => this.setState({ name, unit: this.getUnit(name) })}
              renderItem={(name, isSelected) => (
                <div
                  key={name}
                  style={ isSelected ? styles.highlightedItem : styles.item }
                >{name}</div>
              )}
            />
          </div>
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

export default InputForm;