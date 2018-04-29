import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { removeProject } from '../actions'

class Contract extends React.Component {

  render() {
    let { projects } = this.props
    return (
      <div>
        <h2 className="page-header">合同</h2>
        <table className="table table-bordered">
          <thead>
          <tr>
            <th>合同名称</th>
            <th>合同编号</th>
            <th>外部编号</th>
          </tr>
          </thead>
          <tbody>
          {projects.valueSeq().filter(project => project.type !== '基地仓库').map(project => (
            <tr key={project._id} id={project._id}>
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

const mapStateToProps = state => {
  return {
    projects: state.system.projects
  }
}

export default connect(mapStateToProps)(Contract);