import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFormValues } from 'redux-form'

import OperatorForm from './OperatorForm'
import { updateOperator } from '../../actions'
import { useParams } from 'utils/hooks'
import { PageHeader } from '../../components'

export default () => {

  const form = React.createRef()
  const dispatch = useDispatch()
  const { id } = useParams()
  const { users, projects, operator } = useSelector(state => ({
    users: state.system.users,
    projects: state.system.projects,
    operator: getFormValues('operator')(state)
  }))

  const handleSubmit = (operator) => {
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
    dispatch(updateOperator(
      {
        ...operator,
        perms,
        perm: undefined,
        _id: id
      }
    ))
  }

  const user = users.get(id)
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
    <PageHeader
      title='编辑操作员'
      onSave={() => form.current.submit()}
    >
      <OperatorForm
        initialValues={initialValues}
        projects={projects}
        onSubmit={handleSubmit}
        operator={operator}
        ref={form}
      />
    </PageHeader>
  )
}