import React from 'react';
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import ContractForm from './ContractForm'

class Contract extends React.Component {

  render() {
    let { projects, router, project } = this.props
    const projectId = project
    return (
      <div>
        <h2 className="page-header">合同</h2>
        <ContractForm/>
        <table className="table table-bordered">
          <thead>
          <tr>
            <th>合同名称</th>
            <th>合同编号</th>
            <th>外部编号</th>
          </tr>
          </thead>
          <tbody>
          {projects.valueSeq().filter(project => project.type !== '基地仓库' && (projectId ? project._id === projectId : true) ).map(project => (
            <tr key={project._id} id={project._id} onClick={() => router.push(`/contract/${ project._id }`)}>
              <td>{project.company} {project.name}</td>
              <td>{project._id}</td>
              <td/>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
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