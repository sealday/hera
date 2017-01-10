/**
 * Created by seal on 10/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Dropdown from '../components/Dropdown';
import { Link, IndexLink } from 'react-router';

class Li extends Component {
  static propTypes = {
    to: PropTypes.string,
    onlyActiveOnIndex: PropTypes.bool,
    children: PropTypes.node
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  render() {
    console.dir(this.context);
    const isActive = this.context.router.isActive(this.props.to, this.props.onlyActiveOnIndex);
    const LinkComponent = this.props.onlyActiveOnIndex ? IndexLink : Link;
    const className = isActive ? 'active' : '';
    return (
      <li className={className}>
        <LinkComponent to={this.props.to}>{this.props.children}</LinkComponent>
      </li>
    );
  }
}

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
            <ul className="nav navbar-nav">
              <li><a href="#">Link <span className="sr-only">(current)</span></a></li>
              <li><a href="#">Link</a></li>
              <Dropdown>
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" className="divider"/>
                <li><a href="#">Separated link</a></li>
                <li role="separator" className="divider"/>
                <li><a href="#">fne more separated link</a></li>
              </Dropdown>
            </ul>
            <form className="navbar-form navbar-left">
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Search" />
              </div>
              <button type="submit" className="btn btn-default">Submit</button>
            </form>
            <ul className="nav navbar-nav navbar-right">
              {/*<li><a className="active" href="#">超级管理员</a></li>*/}
              {/*<li className="active"><Link to="profile">超级管理员</Link></li>*/}
              <Li to="profile">超级管理员</Li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;