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
        <h2>新增操作员</h2>
        <OperatorForm onSubmit={this.handleSubmit} />
      </div>
    )
  }
}

export default connect()(OperatorCreate);