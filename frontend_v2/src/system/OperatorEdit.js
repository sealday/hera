/**
 * Created by seal on 25/01/2017.
 */

import React, { Component } from 'react';
import OperatorForm from './OperatorForm'
import { connect } from 'react-redux'
import { updateOperator } from '../actions'

class OperatorEdit extends Component {

  handleSubmit = (operator) => {
    this.props.dispatch(updateOperator(
      {
        ...operator,
        _id: this.props.params.id
      }
    ))
  }

  render() {
    const id = this.props.params.id
    const user = this.props.users.get(id)
    const initialValues = {
      ...user,
      password: undefined
    }

    return (
      <div>
        <button className="btn btn-default" onClick={e => this.props.router.goBack()}>取消</button>
        <h2 className="page-header">操作员编辑</h2>
        <OperatorForm
          initialValues={initialValues}
          onSubmit={this.handleSubmit}
          btnName="保存"
        />
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    users: state.system.users
  }
}

export default connect(mapStateToProps)(OperatorEdit);
