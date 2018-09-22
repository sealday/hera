import React from 'react';
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import ContractForm from './ContractForm'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'

class Contract extends React.Component {

  render() {
    let { projects, router, project } = this.props
    const projectId = project
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
          {projects.valueSeq().filter(project => project.type !== '基地仓库' && (projectId ? project._id === projectId : true) ).map(project => (
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
    );
  }
}

const selector = formValueSelector('contractForm')
const mapStateToProps = state => {
  return {
    projects: state.system.projects,
    project: selector(state, 'project'),
  }
}

export default connect(mapStateToProps)(Contract);