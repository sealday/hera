/**
 * Created by seal on 25/01/2017.
 */

import React, { Component } from 'react';
import TransferForm from './TransferForm'

class TransferCreate extends Component {
  handleSubmit = (data) => {
    //throw new Error('---')
    alert(JSON.stringify(data))
  }

  render() {
    return (
      <div>
        <TransferForm onSubmit={this.handleSubmit}/>
      </div>
    );
  }
}

export default TransferCreate;
