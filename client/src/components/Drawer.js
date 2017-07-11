/**
 * Created by seal on 17/02/2017.
 */
import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { toggleMenu } from '../actions'
import { Link } from 'react-router';
import cx from 'classnames';

const shouldShow = ({user, store}) => {
  if (user.role === '项目部管理员') {
    const perms = user.perms || [];
    const projects = perms.filter((p) => p.insert).map((p) => p.projectId);
    return projects.indexOf(store._id) !== -1;
  } else {
    return true;
  }
}

const Drawer = (props) => (
  <div className={cx({'App-drawer': true, 'show': props.nav.drawer, 'hidden-print': true})}>
    {/* TODO 这里可以考虑改成数组的形式*/}
    <ul>
      <li>
        <a href="#" onClick={e => { e.preventDefault(); props.dispatch(toggleMenu('store')) }}>仓库操作</a>
        <ReactCSSTransitionGroup
          transitionName="nav"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {props.nav.store && shouldShow(props.system) && <ul>
            <li><Link to="/purchase/in/create">采购入库</Link></li>
            <li><Link to="/purchase/out/create">销售出库</Link></li>
            <li><Link to="/transfer/out/create">调拨出库（发料）</Link></li>
            <li><Link to="/transfer/in/create">调拨入库（收料）</Link></li>
            <li><Link to="/stocktaking/in/create">盘点盈余入库</Link></li>
            <li><Link to="/stocktaking/out/create">盘点亏损出库</Link></li>
          </ul>}
          {props.nav.store && !shouldShow(props.system) && <ul><li>您没有权限操作</li></ul>}
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
            {props.system.store.type === '基地仓库' && <div>
              <li><Link to="/simple_search_company">仓库出入库查询（公司）</Link></li>
              <li><Link to="/search">仓库明细检索</Link></li>
              <li><Link to="/store">仓库库存查询</Link></li>
              <li><Link to="/purchase_table">采购入库明细表</Link></li>
              <li><Link to="/sell_table">销售出库明细表</Link></li>
              <li><Link to="/transfer_in_table">调拨入库明细表（收料）</Link></li>
              <li><Link to="/transfer_out_table">调拨出库明细表（发料）</Link></li>
              <li><Link to="/transport_table">运输单查询</Link></li>
              <li><Link to="/stocktaking_in_table">盘点盈余入库明细表</Link></li>
              <li><Link to="/stocktaking_out_table">盘点亏损出库明细表</Link></li>
            </div>}
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
            <li><Link to="/article">物料数据</Link></li>
            <li><Link to="/operator/create">新增操作员</Link></li>
            <li><Link to="/operator">操作员列表</Link></li>
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
            <li><Link to="/project/create">新建项目</Link></li>
            <li><Link to="/project">项目列表</Link></li>
            <li><Link to="/">员工档案</Link></li>
            <li><Link to="/signin">考勤表</Link></li>
            <li><Link to="/">工资卡</Link></li>
            <li><Link to="/worker/create">进场登记卡</Link></li>
            <li><Link to="/signin/check">签到查询</Link></li>
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
            <li><Link to="/accuntvoucher/input">记账凭证输入</Link></li>
            <li><Link to="/finance/payable">应付账款</Link></li>
          </ul>}
        </ReactCSSTransitionGroup>
      </li>
    </ul>
  </div>
)

export default Drawer
