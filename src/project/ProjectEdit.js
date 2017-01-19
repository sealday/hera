/**
 * Created by seal on 13/01/2017.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux'
import shortid from 'shortid'
import {   } from 'immutable'

class ProjectEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      company: '',
      companyTel: '',
      name: '',
      tel: '',
      address: '',
      type: '项目部仓库',
      comments: '',
      contacts: [
        {
          key: shortid.generate(),
          name: '',
          phone: '',
        }
      ]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleContactChange = this.handleContactChange.bind(this);
    this.handleContactAdd = this.handleContactAdd.bind(this);
    this.handleContactRemove = this.handleContactRemove.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    alert(JSON.stringify(this.state));
  }

  handleContactChange(key, name, value) {
    this.setState(prevState => {
      let contacts = [...prevState.contacts];
      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].key == key) {
          contacts[i][name] = value;
        }
      }
      return { contacts };
    });
  }

  handleContactAdd() {
    this.setState(prevState => ({
      contacts: [...prevState.contacts, { key: new Date().getTime(), name: '', phone: '' }]
    }));
  }

  handleContactRemove(key) {
    if (this.state.contacts.length == 1) {
      return;
    }
    this.setState(prevState => {
      let contacts = [...prevState.contacts];
      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].key == key) {
          contacts.splice(i, 1);
        }
      }
      return { contacts };
    });
  }

  handleCancel = (e) => {
    e.preventDefault()
    this.props.router.goBack()
  }

  componentWillReceiveProps(props) {
    if (props.projects.length == 1) return
    const projects = props.projects.filter(p => this.props.params.id == p._id)
    if (projects.length == 1) {
      const project = projects[0]
      let contacts = JSON.stringify(projects)
      this.setState({
        ...projects[0],
        contacts: [...projects[0].contacts]
      })
    }
  }

  render() {
    if (!this.props.projects[this.props.params.id]) {
      return (
        <div className="alert alert-info">
          <p>请求数据中，请稍后</p>
        </div>
      )
    }

    return (
      <div>
        <form className="form-horizontal project-modify-form" method="post" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="control-label col-sm-2">单位名称<span className="important-star">(*)</span></label>
            <div className="col-sm-3">
              <input className="form-control" name="company" type="text" value={this.state.company} required onChange={this.handleChange} />
            </div>
            <label className="control-label col-sm-2">项目名称<span className="important-star">(*)</span></label>
            <div className="col-sm-5">
              <input className="form-control" name="name" type="text" value={this.state.name} required onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2">单位电话</label>
            <div className="col-sm-3">
              <input className="form-control" name="companyTel" type="text" value={this.state.companyTel}  onChange={this.handleChange}/>
            </div>
            <label className="control-label col-sm-2">项目电话</label>
            <div className="col-sm-5">
              <input className="form-control" name="tel" type="text" value={this.state.tel} onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2">地址</label>
            <div className="col-sm-10">
              <input className="form-control" name="address" type="text" value={this.state.address} onChange={this.handleChange} />
            </div>
          </div>
          {this.state.contacts.map(contact => (
            <Contact
              key={contact.key}
              id={contact.key}
              name={contact.name}
              phone={contact.phone}
              onChange={this.handleContactChange}
              onAdd={this.handleContactAdd}
              onRemove={this.handleContactRemove} />
          ))}
          <div className="form-group">
            <label className="control-label col-sm-2">仓库类型</label>
            <div className="col-sm-3">
              <select className="form-control" name="type" onChange={this.handleChange} value={this.state.type}>
                <option>项目部仓库</option>
                <option>基地仓库</option>
                <option>第三方仓库</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2">备注</label>
            <div className="col-sm-10">
              <textarea className="form-control" name="comments" type="text" value={this.state.comments}  onChange={this.handleChange} />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-10 col-sm-2">
              <button className="btn btn-default btn-primary">保存修改</button>
              <button className="btn btn-default btn-default" onClick={this.handleCancel}>取消</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class Contact extends Component {
  static propTypes = {
    onAdd: React.PropTypes.func,
    onRemove: React.PropTypes.func,
    onChange: React.PropTypes.func,
    id: React.PropTypes.number,
    name: React.PropTypes.string,
    phone: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChange(
      this.props.id,
      e.target.name,
      e.target.value
    );
  }

  render() {
    return (
      <div className="form-group">
        <label className="control-label col-sm-2">联系人<span className="important-star">(*)</span></label>
        <div className="col-sm-3">
          <input className="form-control" name="name" type="text" value={this.props.name} required onChange={this.handleChange} />
        </div>
        <label className="control-label col-sm-2">联系人电话<span className="important-star">(*)</span></label>
        <div className="col-sm-5">
          <div className="input-group">
            <input className="form-control" name="phone" type="text" value={this.props.phone} required onChange={this.handleChange} />
            <span className="input-group-btn">
              <a className="btn btn-default" onClick={this.props.onAdd}>
                <span className="glyphicon glyphicon-plus"/>
              </a>
            </span>
            <span className="input-group-btn">
              <a className="btn btn-default" onClick={e => this.props.onRemove(this.props.id)}>
                <span className="glyphicon glyphicon-minus"/>
              </a>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projects: state.projects
  }
}

export default connect(mapStateToProps)(ProjectEdit);
