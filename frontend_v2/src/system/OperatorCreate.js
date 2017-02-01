/**
 * Created by seal on 14/01/2017.
 */

import React, { Component } from 'react';
import OperatorForm from './OperatorForm'
import { connect } from 'react-redux'
import { createOperator } from '../actions'

class OperatorCreate extends Component {

  handleSubmit = (data) => {
    this.props.dispatch(createOperator(data))
  }

  render() {
    return (
      <div>
        <button className="btn btn-default" onClick={e => this.props.router.goBack()}>取消</button>
        <h2 className="page-header">新增操作员</h2>
        <OperatorForm
          onSubmit={this.handleSubmit}
          btnName="创建"
        />
      </div>
    )
  }
}

export default connect()(OperatorCreate);