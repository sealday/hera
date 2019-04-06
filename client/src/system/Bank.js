import React, { Component } from 'react'
import ReactMaskedInput from 'react-text-mask'
import PropTypes from 'prop-types'


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
  }

  handleChange = e => {
    this.props.onChange(
      this.props.id,
      e.target.name,
      e.target.value
    );
  }

  render() {
    const { bank, name, account, onAdd, onRemove, id } = this.props
    return (
      <>
        <div className="form-group" >
          <label className="control-label col-sm-2">开户行</label>
          <div className="col-sm-3">
            <input className="form-control" name="bank" type="text" value={bank} onChange={this.handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2">账户名</label>
          <div className="col-sm-3">
            <input className="form-control" name="name" type="text" value={name} onChange={this.handleChange} />
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
                value={account}
                onChange={this.handleChange}
              />
              <span className="input-group-btn">
              <a className="btn btn-default" onClick={onAdd}>
                <span className="glyphicon glyphicon-plus"/>
              </a>
            </span>
              <span className="input-group-btn">
              <a className="btn btn-default" onClick={e => onRemove(id)}>
                <span className="glyphicon glyphicon-minus"/>
              </a>
            </span>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Bank