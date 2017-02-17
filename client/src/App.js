import React, { Component } from 'react';
import { connect } from 'react-redux'
import { toggleNav } from './actions'
import './App.css';
import { Notification, Navbar, Drawer, CurrentStore } from './components'


class App extends Component {
  isStoreSelected() {
    return this.props.system.store
  }
  render() {
    // TODO 考虑整理下目录，让目录由配置文件生成，而不是现在纯粹手写，纯粹手写需要在很多地方修改，容易出错，而且看起来不方便，并且重复工作太多
    const props = this.props
    return (
      <div className="App">
        <Notification/>
        <Navbar/>
        {this.isStoreSelected() && (
          <div>
            <Drawer {...props}/>
            <button onClick={e => props.dispatch(toggleNav())} type="button" className="App-drawer-toggle"/>
            <div className="App-content">
              <div className="container-fluid">
                {props.children}
              </div>
            </div>
          </div>
        )}
        {!this.isStoreSelected() && (
          <CurrentStore/>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    nav: state.nav,
    system: state.system,
  }
}

export default connect(mapStateToProps)(App);
