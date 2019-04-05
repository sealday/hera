import React, { Component } from 'react'
import ReactMaskedInput from 'react-text-mask'
import PropTypes from 'prop-types'
import {Field} from 'redux-form'


class Bank extends Component {
  static propTypes = {
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    onChange: PropTypes.func,
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    bank: PropTypes.string,
    name: PropTypes.string,
    account: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChange(
      this.props.id,
      e.target.name,
      e.target.value
    );
  }

  render() {
    return (
      [
        <div className="form-group" key={0}>
          <label className="control-label col-sm-2">开户行</label>
          <div className="col-sm-3">
            <input className="form-control" name="bank" type="text" value={this.props.bank} onChange={this.handleChange} />
          </div>
        </div>,
        <div className="form-group" key={1}>
          <label className="control-label col-sm-2">账户名</label>
          <div className="col-sm-3">
            <input className="form-control" name="name" type="text" value={this.props.name} onChange={this.handleChange} />
          </div>
          <label className="control-label col-sm-2">卡号</label>
          <div className="col-sm-5">
            <div className="input-group">
              <ReactMaskedInput
                guide={false}
                mask={[
                  /\d/, /\d/, /\d/, /\d/, ' ',
                  /\d/, /\d/, /\d/, /\d/, ' ',
                  /\d/, /\d/, /\d/, /\d/, ' ',
                  /\d/, /\d/, /\d/, /\d/, ' ',
                  /\d/, /\d/, /\d/,
                ]}
                className="form-control"
                name="account"
                type="text"
                value={this.props.account}
                onChange={this.handleChange}
              />
              <span className="input-group-btn">
              <a className="btn btn-default" onClick={this.props.onAdd}>
                <span className="glyphicon glyphicon-plus"/>
              </a>
            </span>
              <span className="input-group-btn">
              <a className="btn btn-default" onClick={e => this.props.onRemove(this.props.id)}>
                <span className="glyphicon glyphicon-minus"/>
              </a>
            </span>
            </div>
          </div>
        </div>
      ]
    )
  }
}

export default Bank