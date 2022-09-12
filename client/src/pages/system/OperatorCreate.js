import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFormValues } from 'redux-form'

import OperatorForm from './OperatorForm'
import { createOperator } from '../../actions'
import { PageHeader } from '../../components'

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
      <PageHeader
        title='新增操作员'
        onSave={() => this.form.submit()}
      >
        <OperatorForm
          projects={projects}
          onSubmit={this.handleSubmit}
          operator={operator}
          ref={form => this.form = form}
        />
      </PageHeader>
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