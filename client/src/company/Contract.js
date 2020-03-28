import React from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { includes } from 'lodash'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardHeader,
} from '@material-ui/core'

import ContractForm from './ContractForm'
import { CONTRACT_TYPES } from '../utils'

class Contract extends React.Component {

  render() {
    let { projects, router, project } = this.props
    const projectId = project
    projects = projects.valueSeq().filter(project =>
      includes(CONTRACT_TYPES, project.type) &&
      (projectId ? project._id === projectId : true))
    return (
      <Card>
        {/* TODO 综合访问频率、上次访问排序 */}
        <CardHeader title="合同列表"/>
        <ContractForm/>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>合同名称</TableCell>
              <TableCell>合同编号</TableCell>
              <TableCell>外部编号</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {projects.map(project => (
            <TableRow key={project._id}
                      id={project._id}
                      onClick={() => router.push(`/contract/${ project._id }`)}
                      hover={true}
            >
              <TableCell>{project.company} {project.name}</TableCell>
              <TableCell>{project._id}</TableCell>
              <TableCell/>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </Card>
    )
  }
}

const selector = formValueSelector('contractForm')
const mapStateToProps = state => {
  return {
    projects: state.system.projects,
    project: selector(state, 'project'),
  }
}

export default connect(mapStateToProps)(Contract)