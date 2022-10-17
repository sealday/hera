import React, { Component } from 'react'
import ReactMaskedInput from 'react-text-mask'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'


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
          <label className="control-label col-md-2">开户行</label>
          <div className="col-md-3">
            <Input name="bank" type="text" value={bank} onChange={this.handleChange} />
          </div>
          <label className="control-label col-md-2">账户名</label>
          <div className="col-md-5">
            <Input
              name="name" type="text" value={name} onChange={this.handleChange}
              addonAfter={<>
                <span onClick={onAdd} style={{ marginRight: '5px', cursor: 'pointer' }}><PlusOutlined /></span>
                <span onClick={e => onRemove(id)} style={{ cursor: 'pointer' }}><MinusOutlined /></span>
              </>}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">卡号</label>
          <div className="col-md-10">
            <div className="input-group">
              <ReactMaskedInput
                guide={false}
                mask={[
                  /\d/, /\d/, /\d/, /\d/, ' ',
                  /\d/, /\d/, /\d/, /\d/, ' ',
                  /\d/, /\d/, /\d/, /\d/, ' ',
                  /\d/, /\d/, /\d/, /\d/, ' ',
                  /\d/, /\d/, /\d/, /\d/
                ]}
                className="ant-input"
                name="account"
                type="text"
                value={account}
                onChange={this.handleChange}
              />
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Bank