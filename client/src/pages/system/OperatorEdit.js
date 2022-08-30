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
import { updateOperator } from '../../actions'

class OperatorEdit extends Component {

  handleSubmit = (operator) => {
    const perm = operator.perm || {};
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
    this.props.dispatch(updateOperator(
      {
        ...operator,
        perms,
        perm: undefined,
        _id: this.props.params.id
      }
    ))
  }

  render() {
    const id = this.props.params.id
    const user = this.props.users.get(id)
    const { projects, operator } = this.props;
    const perms = user.perms || [];
    const perm = {};
    perms.forEach((p) => {
      perm[p.projectId] = p;
    });
    user.perm = perm;
    const initialValues = {
      ...user,
      password: undefined
    }

    return (
      <Card>
        <CardHeader
          title="操作员编辑"
          action={<>
            <Button onClick={e => this.props.router.goBack()}>取消</Button>
            <Button color="primary" onClick={e => this.form.submit()}>保存</Button>
          </>}
        />
        <CardContent>
          <OperatorForm
            initialValues={initialValues}
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
    users: state.system.users,
    projects: state.system.projects,
    operator: getFormValues('operator')(state)
  }
}

export default connect(mapStateToProps)(OperatorEdit);
