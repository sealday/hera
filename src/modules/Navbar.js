/**
 * Created by seal on 10/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Dropdown from '../components/Dropdown';
import { Link, IndexLink } from 'react-router';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown: false,
      collapse: false
    };
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse(e) {
    e.preventDefault();
    this.setState(prevState => { return { collapse: !prevState.collapse } });
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  render() {
    return (
      <nav className="navbar navbar-default navbar-inverse">
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
            <ul className="nav navbar-nav navbar-right">
              <li className={cx({active: this.context.router.isActive("profile")})}><Link to="profile">超级管理员</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;