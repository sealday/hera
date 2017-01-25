/**
 * Created by seal on 25/01/2017.
 */

import React, { Component } from 'react';
import OperatorForm from './OperatorForm'
import { connect } from 'react-redux'

class OperatorEdit extends Component {

  handleSubmit = (data) => {
    alert(JSON.stringify(data))
  }

  render() {
    const id = this.props.params.id
    const user = this.props.users.get(id)
    const initialValues = {
      username: user.username,
      profile: user.profile
    }

    return (
      <div>
        <button className="btn btn-default" onClick={e => this.props.router.goBack()}>取消</button>
        <OperatorForm
          initialValues={initialValues}
          onSubmit={this.handleSubmit} />
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
