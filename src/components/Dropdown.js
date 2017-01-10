/**
 * Created by seal on 10/01/2017.
 */

import React, { Component } from 'react';
import cx from 'classnames';

/**
 * React 可能会鼓励更彻底的包装，不显示实现的任何细节
 * 但是这里我选择对状态的简单包装，使用自己的组件需要知道实现的细节
 * 比如这个地方需要知道它传入的参数应该是 li 数组
 */
class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown: false
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleUnfocus = this.handleUnfocus.bind(this);
  }

  handleUnfocus(e) {
    if (e.target !== this.a) {
      this.setState({ dropdown: false });
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleUnfocus, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleUnfocus, false);
  }

  toggleDropdown(e) {
    e.preventDefault();
    this.setState(prevState => { return { dropdown: !prevState.dropdown } });
  }

  render() {
    return (
      <li className={cx({dropdown: true, open: this.state.dropdown})}>
        <a href="#" onClick={this.toggleDropdown} ref={a => this.a = a}>Dropdown <span className="caret" /></a>
        <ul className="dropdown-menu">
          {this.props.children}
        </ul>
      </li>
    );
  }
}

export default Dropdown;
