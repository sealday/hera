/**
 * Created by seal on 14/01/2017.
 */

import React, { Component } from 'react';
import OperatorForm from './OperatorForm'
import { connect } from 'react-redux'
import { createOperator } from '../actions'
import { getFormValues } from 'redux-form'

class OperatorCreate extends Component {

  handleSubmit = (data) => {
    const perm = data.perm || {};
    const perms = [];
    for (let projectId in perm) {
      if (perm.hasOwnProperty(projectId)) {
        perms.push({
          projectId,
          query: perm[projectId].query || false,
          update: perm[projectId].update || false,
          insert: perm[projectId].insert || false,
        });
      }
    }
    data.perms = perms;
    this.props.dispatch(createOperator(data))
  }

  render() {
    const { projects, operator } = this.props;
    return (
      <div>
        <button className="btn btn-default" onClick={e => this.props.router.goBack()}>取消</button>
        <h2 className="page-header">新增操作员</h2>
        <OperatorForm
          projects={projects}
          onSubmit={this.handleSubmit}
          btnName="创建"
          operator={operator}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    projects: state.system.projects,
    operator: getFormValues('operator')(state),
  }
}

export default connect(mapStateToProps)(OperatorCreate);