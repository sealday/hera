/**
 * Created by seal on 13/01/2017.
 */

import React, { Component } from 'react';

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };

    this.store = window.store;
  }

  componentDidMount() {
    this.unsubscribe = this.store.subscribe(() => {
      let projects = this.store.getState().projects;
      this.setState({projects});
    });

    let projects = this.store.getState().projects;
    this.setState({projects});
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

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
          </tr>
          </thead>
          <tbody>
          {this.state.projects.map(project => (
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
              {/*<td>{project.contacts}</td>*/}
              <td>{project.type}</td>
              <td>{project.comments}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Project;