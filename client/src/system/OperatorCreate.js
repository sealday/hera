import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFormValues } from 'redux-form'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'

import OperatorForm from './OperatorForm'
import { createOperator } from '../actions'

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
      <Card>
        <CardHeader
          title="新增操作员"
          action={<>
            <Button onClick={e => this.props.router.goBack()}>取消</Button>
            <Button color="primary" onClick={e => this.form.submit()}>保存</Button>
          </>}
        />
        <CardContent>
          <OperatorForm
            projects={projects}
            onSubmit={this.handleSubmit}
            operator={operator}
            ref={form => this.form = form}
          />
        </CardContent>
      </Card>
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