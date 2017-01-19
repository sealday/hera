/**
 * Created by seal on 13/01/2017.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router'

class Project extends Component {
  render() {
    return (
      <div>
        <table className="table">
          <thead>
          <tr>
            <th>公司名称</th>
            <th>公司电话</th>
            <th>项目部名称</th>
            <th>项目部电话</th>
            <th>项目部地址</th>
            <th>联系人</th>
            <th>仓库类型</th>
            <th>备注</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          {this.props.projects.map(project => (
            <tr key={project._id}>
              <td>{project.company}</td>
              <td>{project.companyTel}</td>
              <td>{project.name}</td>
              <td>{project.tel}</td>
              <td>{project.address}</td>
              <td>
                {project.contacts.map(contact => (
                  <p key={contact.name + contact.phone}>
                    <span>{contact.name}</span>
                    <span>{contact.phone}</span>
                  </p>
                ))}
              </td>
              <td>{project.type}</td>
              <td>{project.comments}</td>
              <td>
                <Link to={`/project/${project._id}/edit`} >编辑</Link>
              </td>
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
    projects: state.projects
  }
}

export default connect(mapStateToProps)(Project);