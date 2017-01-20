import React, { Component } from 'react';
import cx from 'classnames';
import { Link } from 'react-router';
import Navbar from './modules/Navbar';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawer: false,
      nav: {
        store: true,
        report: true,
        system: false,
        project: false
      }
    };
  }

  toggleDrawer = () => {
    this.setState(prevState => {
      return {
        drawer: !prevState.drawer
      }
    });
  }

  toggleNav = (name) => {
    this.setState(prevState => ({
      nav: {
        ...prevState.nav,
        [name]: !prevState.nav[name]
      }
    }))
  }

  handleClick = (e) => {
    e.preventDefault()

    this.setState(prevState => ({
      store: !prevState.store
    }))
  }

  render() {
    // TODO 考虑整理下目录，让目录由配置文件生成，而不是现在纯粹手写，纯粹手写需要在很多地方修改，容易出错，而且看起来不方便，并且重复工作太多
    return (
      <div className="App">
        <Navbar/>
        <div className="container-fluid" style={{height: '100%'}}>
          <div className="row" style={{position: 'relative', height: '100%'}}>
            <div className={cx({ 'col-sm-2': true, 'App-drawer': true, 'show': this.state.drawer })}>
              {/* TODO 这里可以考虑改成数组的形式*/}
              <ul>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); this.toggleNav('store')}}>仓库</a>
                  <ReactCSSTransitionGroup
                    transitionName="nav"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {this.state.nav.store && <ul>
                      <li><Link to="purchase">采购入库</Link></li>
                      <li><Link to="transfer_out">调拨出库（发料）</Link></li>
                      <li><Link to="transfer_in">调拨入库（收料）</Link></li>
                    </ul>}
                  </ReactCSSTransitionGroup>
                </li>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); this.toggleNav('report')}}>报表</a>
                  <ReactCSSTransitionGroup
                    transitionName="nav"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {this.state.nav.report && <ul>
                      <li><Link to="store">库存</Link></li>
                      <li><Link to="transfer_in_table">入库明细表</Link></li>
                      <li><Link to="transfer_out_table">出库明细表</Link></li>
                      <li><a href="#">费用明细表</a></li>
                      <li><a href="#">财务收款明细表</a></li>
                      <li><a href="#">财务付款明细表</a></li></ul>}
                  </ReactCSSTransitionGroup>
                </li>
                <li>
                  <Link to="/file_manager">文件中转站</Link>
                </li>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); this.toggleNav('system')}}>系统基础数据</a>
                  <ReactCSSTransitionGroup
                    transitionName="nav"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {this.state.nav.system && <ul>
                      <li><Link to="article">物料数据</Link></li>
                      <li><Link to="operator_create">新增操作员</Link></li>
                      <li><Link to="operator">操作员列表</Link></li>
                    </ul>}
                  </ReactCSSTransitionGroup>
                </li>
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); this.toggleNav('project')}}>项目信息</a>
                  <ReactCSSTransitionGroup
                    transitionName="nav"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {this.state.nav.project && <ul>
                      <li><Link to="project_create">新建项目</Link></li>
                      <li><Link to="project">项目列表</Link></li>
                      <li><Link>员工档案</Link></li>
                      <li><Link>考勤表</Link></li>
                    </ul>}
                  </ReactCSSTransitionGroup>
                </li>
              </ul>
            </div>
            <button onClick={this.toggleDrawer} type="button" className="App-drawer-toggle"/>
            <div className="col-sm-10 App-content">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
