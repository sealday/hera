/**
 * Created by seal on 14/01/2017.
 */

import React, { Component } from 'react';
import OperatorForm from './OperatorForm'

class OperatorCreate extends Component {

  handleSubmit = (data) => {
    alert(JSON.stringify(data))
  }

  render() {
    return (
      <OperatorForm onSubmit={this.handleSubmit} />
    )
  }
}

export default OperatorCreate;