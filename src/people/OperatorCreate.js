/**
 * Created by seal on 14/01/2017.
 */

import React, { Component } from 'react';

class OperatorCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      profile: {
        name: ''
      }
    }
  }

  handleChange(e) {
    switch (e.target.name) {
      case 'username':
      case 'password':
        this.setState({
          [e.target.name]: e.target.value
        })
        break
      case 'name':
        this.setState({
          profile: {
            name: e.target.value
          }
        })
        break
    }
  }

  render() {
    return (
      <div>
        <form>
          <div className="form-group">
            <label>用户名</label>
            <input
              name="username"
              type="text"
              className="form-control"
              value={this.state.username}
              onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label>密码</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={this.state.password}
              onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label>姓名</label>
            <input
              name="name"
              type="text"
              className="form-control"
              value={this.state.profile.name}
              onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <button className="btn btn-primary">创建操作员</button>
          </div>
        </form>
      </div>
    )
  }
}

export default OperatorCreate;