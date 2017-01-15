import 'bluebird';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import FileManager from './modules/FileManager';
import Profile from './modules/Profile';
import Home from './modules/Home';
import Article from './modules/Article';
import Purchase from './store/Purchase';
import TransferIn from './store/TransferIn';
import TransferInTable from './report/TransferInTable'
import Operator from './people/Operator'
import OperatorCreate from './people/OperatorCreate'
import TransferOut from './store/TransferOut';
import TransferOutTable from './report/TransferOutTable'
import TransferOrder from './store/TransferOrder'
import TransferOutEdit from './store/TransferOutEdit'

import Project from './project/Project';
import ProjectCreate from './project/ProjectCreate';
import BaseStore from './project/BaseStore'
import OtherStore from './project/OtherStore'

import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-select/dist/react-select.css';
import 'react-tagsinput/react-tagsinput.css';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';
import { ajax } from './utils';
import io from 'socket.io-client';
import { createStore } from 'redux';
import { Provider } from 'react-redux'


import moment from 'moment';

moment.locale('zh-CN');

const initialState = {
  base: {},
  projects: [],
  projectIdMap: {},
  recordIdMap: {},
  articles: [],
  num: 0,
  users: [],
  outRecords: [],
  outRecordsRequestStatus: 'IDLE', // IDLE NEED_REQUEST REQUESTING
  inRecords: [],
  inRecordsRequestStatus: 'IDLE', // IDLE NEED_REQUEST REQUESTING
};

const store = createStore((state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_PROJECTS":
      const projects = action.projects;
      const projectIdMap = {}
      let base = {}
      projects.forEach(project => {
        projectIdMap[project._id] = project
        if (project.type == '基地仓库') {
          base = project
        }
      })
      return {...state, projects, projectIdMap, base};
    case "UPDATE_ARTICLES":
      const articles = action.articles;
      return {...state, articles};
    case 'UPDATE_RECORDS_CACHE':
      const record = action.record
      const recordIdMap = {...state.recordIdMap, [record._id]: record}
      return {...state, recordIdMap}
    case 'UPDATE_NUM':
      const num  = action.num
      return {...state, num}
    case 'UPDATE_USERS':
      const users = action.users
      return {...state, users}
    case 'UPDATE_OUT_RECORDS':
      const outRecords = action.records
      return {...state, outRecords}
    case 'REQUEST_OUT_RECORDS':
      const outRecordsRequestStatus = action.status
      return {...state, outRecordsRequestStatus}
    case 'UPDATE_IN_RECORDS':
      const inRecords = action.records
      return {...state, inRecords}
    case 'REQUEST_IN_RECORDS':
      const inRecordsRequestStatus = action.status
      return {...state, inRecordsRequestStatus}
    default:
      return state;
  }
});

// 在显示之前，先确定当前的用户已经登录！
ajax('/api/is_login').then(() => {
  // 初始化数据
  ajax('/api/project').then(res => {
    const projects = res.data.projects
    store.dispatch({ type: "UPDATE_PROJECTS", projects });
  }).catch(res => {
    alert('出错了' + JSON.stringify(res));
  });

  ajax('/api/article').then(res => {
    const articles = res.data.articles
    store.dispatch({ type: 'UPDATE_ARTICLES', articles })
  }).catch(res => {
    alert('出错了' + JSON.stringify(res));
  });

  ajax('/api/user').then(res => {
    const users = res.data.users
    store.dispatch({ type: 'UPDATE_USERS', users })
  }).catch(res => {
    alert('出错了！' + JSON.stringify(res))
  })

  const socket = io();

  socket.on('server:num', num => {
    store.dispatch({ type: 'UPDATE_NUM',  num })
  });

  store.subscribe(() => {
    if (store.getState().outRecordsRequestStatus != 'NEED_REQUEST') return
    if (store.getState().projects.length == 0) return

    const bases = store.getState().projects.filter(project => project.type == '基地仓库')
    const outStock = bases.length > 0 ? bases[0]._id : ''

    if (outStock) {
      store.dispatch({ type: 'REQUEST_OUT_RECORDS', status: 'REQUESTING' })
      ajax('/api/transfer', {
        data: {
          outStock: outStock
        }
      }).then(res => {
        const records = res.data.records
        store.dispatch({ type: 'UPDATE_OUT_RECORDS', records })
        store.dispatch({ type: 'REQUEST_OUT_RECORDS', status: 'IDLE' })
      }).catch(err => {
        alert('出错了！获取出库数据' + JSON.stringify(err))
        store.dispatch({ type: 'REQUEST_OUT_RECORDS', status: 'IDLE' })
      })
    }
  })

  store.subscribe(() => {
    if (store.getState().inRecordsRequestStatus != 'NEED_REQUEST') return
    if (store.getState().projects.length == 0) return

    const bases = store.getState().projects.filter(project => project.type == '基地仓库')
    const inStock = bases.length > 0 ? bases[0]._id : ''

    if (inStock) {
      store.dispatch({ type: 'REQUEST_IN_RECORDS', status: 'REQUESTING' })
      ajax('/api/transfer', {
        data: {
          inStock: inStock
        }
      }).then(res => {
        const records = res.data.records
        store.dispatch({ type: 'UPDATE_IN_RECORDS', records })
        store.dispatch({ type: 'REQUEST_IN_RECORDS', status: 'IDLE' })
      }).catch(err => {
        alert('出错了！获取出库数据' + JSON.stringify(err))
        store.dispatch({ type: 'REQUEST_IN_RECORDS', status: 'IDLE' })
      })
    }
  })

  ReactDOM.render((
    <Provider store={store}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="file_manager" component={FileManager}/>
          <Route path="operator" component={Operator}/>
          <Route path="operator_create" component={OperatorCreate}/>

          <Route path="project" component={Project}/>
          <Route path="project_create" component={ProjectCreate}/>
          <Route path="base_store" component={BaseStore}/>
          <Route path="other_store" component={OtherStore}/>

          <Route path="profile" component={Profile}/>
          <Route path="article" component={Article}/>
          <Route path="purchase" component={Purchase}/>
          <Route path="transfer_in" component={TransferIn}/>
          <Route path="transfer_out" component={TransferOut}/>
          <Route path="transfer_in_table" component={TransferInTable} />
          <Route path="transfer_order/:recordId" component={TransferOrder}/>
          <Route path="transfer_out/:recordId" component={TransferOutEdit}/>
          <Route path="transfer_out_table" component={TransferOutTable} />

        </Route>
      </Router>
    </Provider>
    ), document.getElementById('root')
  );
});
