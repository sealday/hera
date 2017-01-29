/**
 * Created by seal on 13/01/2017.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux'
import shortid from 'shortid'
import Contact from './Contact'
import { ajax } from '../utils'

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
      ],
      loading: true
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
    ajax('/api/project/' + this.props.params.id, {
      data: JSON.stringify(this.state),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      alert(res.message + "\n稍后将自动跳转到项目列表")
      ajax('/api/project').then(res => {
        const projects = res.data.projects
        this.props.dispatch({ type: "UPDATE_PROJECTS", projects });
        this.props.router.push('/project')
      }).catch(res => {
        alert('更新项目列表出错' + JSON.stringify(res));
      });

    }).catch(err => {
      alert(`更新项目出错了！${JSON.stringify(err)}`)
    })
  }

  handleContactChange(key, name, value) {
    this.setState(prevState => {
      let contacts = [...prevState.contacts];
      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].key === key) {
          contacts[i][name] = value;
        }
      }
      return { contacts };
    });
  }

  handleContactAdd() {
    this.setState(prevState => ({
      contacts: [...prevState.contacts, { key: shortid.generate(), name: '', phone: '' }]
    }));
  }

  handleContactRemove(key) {
    if (this.state.contacts.length === 1) {
      return;
    }
    this.setState(prevState => {
      let contacts = [...prevState.contacts];
      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].key === key) {
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
    let projects = props.projects.filter(project => project._id === this.props.router.params.id)
    if (projects.length === 1) {
      let project = {
        ...projects[0]
      }
      let contacts = []
      project.contacts.forEach(contact => {
        contacts.push({
          ...contact,
          key: shortid.generate()
        })
      })
      project.contacts = contacts
      this.setState({
        ...project,
        loading: false
      })
    }
  }

  render() {

    if (this.state.loading) {
      return (
        <div className="alert alert-info">
          <p>正在加载中，请稍候，如果等待时间过长，刷新一下重试</p>
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

const mapStateToProps = state => {
  return {
    projects: state.projects
  }
}

export default connect(mapStateToProps)(ProjectEdit);
