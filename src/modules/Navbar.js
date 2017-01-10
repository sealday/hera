/**
 * Created by seal on 10/01/2017.
 */

import React, { Component } from 'react';
import cx from 'classnames';
import Dropdown from '../components/Dropdown';

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
            <button onClick={this.toggleCollapse} type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Brand</a>
          </div>
          <div className={cx({collapse: true, 'navbar-collapse': true, in: this.state.collapse})}>
            <ul className="nav navbar-nav">
              <li><a href="#">Link <span className="sr-only">(current)</span></a></li>
              <li><a href="#">Link</a></li>
              <Dropdown>
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="#">Separated link</a></li>
                <li role="separator" className="divider"></li>
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
              <li><a href="#">Link</a></li>
              <Dropdown>
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="#">Separated link</a></li>
              </Dropdown>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;