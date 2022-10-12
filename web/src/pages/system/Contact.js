import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMaskedInput from 'react-text-mask'
import { Input } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'


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
    const { onAdd, onRemove } = this.props
    return (
      <>
        <div className="form-group">
          <label className="control-label col-md-2">联系人<span className="important-star">(*)</span></label>
          <div className="col-md-3">
            <Input name="name" type="text" value={this.props.name} required onChange={this.handleChange} />
          </div>
          <label className="control-label col-md-2">联系人电话<span className="important-star">(*)</span></label>
          <div className="col-md-5">
            <div className="input-group">
              <Input
                 name="phone" type="text" value={this.props.phone} required onChange={this.handleChange}
                 addonAfter={
                   <>
                     <span onClick={onAdd} style={{ marginRight: '5px', cursor: 'pointer' }}><PlusOutlined /></span>
                     <span onClick={e => onRemove(this.props.id)} style={{ cursor: 'pointer' }}><MinusOutlined /></span>
                   </>
                 }
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">身份证号</label>
          <div className="col-md-10">
            <ReactMaskedInput
              guide={false}
              mask={[
                /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, ' ',
                /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, ' ',
                /\d/, /\d/, /\d/, /\d|x|X/,
              ]}
              className="ant-input"
              name="number"
              type="text"
              value={this.props.number}
              onChange={this.handleChange}
            />
          </div>
        </div>
      </>
    )
  }
}

export default Contact
