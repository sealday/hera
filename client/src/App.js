import React, { Component } from 'react';
import cx from 'classnames';
import { Link } from 'react-router';
import Navbar from './Navbar';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { connect } from 'react-redux'
import { toggleMenu, toggleNav } from './actions'
import './App.css';
import { Notification } from './components'
import CurrentStore from './CurrentStore'

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
        <div className="container-fluid" style={{height: '100%'}}>
          <div className="row" style={{position: 'relative', height: '100%'}}>
            <div className={cx({ 'col-sm-2': true, 'App-drawer': true, 'show': props.nav.drawer, 'hidden-print': true})}>
              {/* TODO 这里可以考虑改成数组的形式*/}
              <ul>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); props.dispatch(toggleMenu('store')) }}>仓库操作</a>
                  <ReactCSSTransitionGroup
                    transitionName="nav"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {props.nav.store && <ul>
                      <li><Link to="/purchase/in/create">采购入库</Link></li>
                      <li><Link to="/purchase/out/create">销售出库</Link></li>
                      <li><Link to="/transfer/out/create">调拨出库（发料）</Link></li>
                      <li><Link to="/transfer/in/create">调拨入库（收料）</Link></li>
                      <li><Link to="/">盘点盈余入库</Link></li>
                      <li><Link to="/">盘点亏损出库</Link></li>
                    </ul>}
                  </ReactCSSTransitionGroup>
                </li>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); props.dispatch(toggleMenu('report'))}}>仓库查询</a>
                  <ReactCSSTransitionGroup
                    transitionName="nav"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {props.nav.report && <ul>
                      <li><Link to="/simple_search">仓库出入库查询</Link></li>
                      <li><Link to="/search">仓库明细检索</Link></li>
                      <li><Link to="/store">仓库库存查询</Link></li>
                      <li><Link to="/purchase_table">采购入库明细表</Link></li>
                      <li><Link to="/sell_table">销售出库明细表</Link></li>
                      <li><Link to="/transfer_in_table">调拨入库明细表（收料）</Link></li>
                      <li><Link to="/transfer_out_table">调拨出库明细表（发料）</Link></li>
                      <li><Link to="/transport_table">运输单查询</Link></li>
                      <li><Link to="/">盘点盈余入库明细表</Link></li>
                      <li><Link to="/">盘点亏损出库明细表</Link></li>
                    </ul>}
                  </ReactCSSTransitionGroup>
                </li>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); props.dispatch(toggleMenu('file'))}}>文件</a>
                  <ReactCSSTransitionGroup
                    transitionName="nav"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {props.nav.file && <ul>
                      <li><Link to="/file_manager">文件管理</Link></li>
                    </ul>}
                  </ReactCSSTransitionGroup>
                </li>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); props.dispatch(toggleMenu('system'))}}>系统</a>
                  <ReactCSSTransitionGroup
                    transitionName="nav"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {props.nav.system && <ul>
                      <li><Link to="article">物料数据</Link></li>
                      <li><Link to="operator/create">新增操作员</Link></li>
                      <li><Link to="operator">操作员列表</Link></li>
                    </ul>}
                  </ReactCSSTransitionGroup>
                </li>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); props.dispatch(toggleMenu('project'))}}>项目信息</a>
                  <ReactCSSTransitionGroup
                    transitionName="nav"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {props.nav.project && <ul>
                      <li><Link to="project_create">新建项目</Link></li>
                      <li><Link to="project">项目列表</Link></li>
                      <li><Link to="">员工档案</Link></li>
                      <li><Link to="">考勤表</Link></li>
                      <li><Link to="">工资卡</Link></li>
                      <li><Link to="/worker_checkin">进场登记卡</Link></li>
                    </ul>}
                  </ReactCSSTransitionGroup>
                </li>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); props.dispatch(toggleMenu('finance'))}}>财务</a>
                  <ReactCSSTransitionGroup
                    transitionName="nav"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {props.nav.finance && <ul>
                      <li><Link to="">运费结算查询</Link></li>
                    </ul>}
                  </ReactCSSTransitionGroup>
                </li>

              </ul>
            </div>
            <button onClick={e => props.dispatch(toggleNav())} type="button" className="App-drawer-toggle"/>
            <div className="col-sm-10 App-content">
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
