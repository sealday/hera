/**
 * Created by seal on 10/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import { Link } from 'react-router';
import { ajax } from '../utils';
import { connect } from 'react-redux'
import { selectStore } from '../actions'

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown: false,
      collapse: false
    };
  }

  logout = () => {
    // TODO 这里出错？？？ 总是重定向到首页
    ajax('/api/logout', {
      method: 'POST'
    }).then(res => {
    }).catch(err => {
    }).then(() => {
      location.href = "login.html";
    });
  }

  toggleCollapse = e => {
    e.preventDefault();
    this.setState(prevState => { return { collapse: !prevState.collapse } });
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  render() {
    const { store, num } = this.props
    return (
      <nav className="navbar navbar-default navbar-fixed-top navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <button onClick={this.toggleCollapse} type="button" className="navbar-toggle collapsed">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
            </button>
            <a className="navbar-brand" href="#">赫拉管理系统</a>
          </div>
          <div className={cx({collapse: true, 'navbar-collapse': true, in: this.state.collapse})}>
            <ul className="nav navbar-nav">
              <li><p className="navbar-text">{store && store.company + store.name}</p></li>
              <li><a href="#" onClick={ e => { e.preventDefault(); this.props.dispatch(selectStore(false))} }>管理其他仓库</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><p className="navbar-text">当前在线人数{num}</p></li>
              <li><a href="#" onClick={this.logout}>登出</a></li>
              <li className={cx({active: this.context.router.isActive("profile")})}><Link to="profile">超级管理员</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    num: state.system.online,
    store: state.system.store,
  }
}

export default connect(mapStateToProps)(Navbar)