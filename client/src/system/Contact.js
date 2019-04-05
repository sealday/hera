import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMaskedInput from 'react-text-mask'


class Contact extends Component {
  static propTypes = {
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    onChange: PropTypes.func,
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    name: PropTypes.string,
    phone: PropTypes.string,
    number: PropTypes.string,
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
          <label className="control-label col-sm-2">联系人<span className="important-star">(*)</span></label>
          <div className="col-sm-3">
            <input className="form-control" name="name" type="text" value={this.props.name} required onChange={this.handleChange} />
          </div>
          <label className="control-label col-sm-2">联系人电话<span className="important-star">(*)</span></label>
          <div className="col-sm-5">
            <div className="input-group">
              <input className="form-control" name="phone" type="text" value={this.props.phone} required onChange={this.handleChange} />
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
        </div>,
        <div className="form-group" key={1}>
          <label className="control-label col-sm-2">身份证号</label>
          <div className="col-sm-10">
            <ReactMaskedInput
              guide={false}
              mask={[
                /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, ' ',
                /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, ' ',
                /\d/, /\d/, /\d/, /\d/,
              ]}
              className="form-control"
              name="number"
              type="text"
              value={this.props.number}
              onChange={this.handleChange}
            />
          </div>
        </div>,
      ]
    );
  }
}

export default Contact