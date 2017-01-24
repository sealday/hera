// 使用 bluebird 的 promise 实现
// TODO 需要测试下实际中浏览器的兼容性
import 'bluebird';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { reducer as formReducer } from 'redux-form'
import { Provider } from 'react-redux'
import * as reducers from './reducers'
import * as actionTypes from './actions'

import App from './App';
import Home from './Home';

import { Article, Operator, OperatorCreate } from './system'
import { FileManager } from './file'
import { Purchase, TransferIn, TransferInEdit, TransferOut, TransferOutEdit, TransferOrder} from './store'
import { TransferInTable, TransferOutTable, Store } from './report'
import { Project, ProjectCreate, ProjectEdit, BaseStore, OtherStore } from './project'
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import { ajax } from './utils';
import io from 'socket.io-client';

// css 除非是模块自己的，否则直接在这里进行全局 import
import 'bootstrap/dist/css/bootstrap.css';
import 'react-select/dist/react-select.css';
import 'react-tagsinput/react-tagsinput.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'animate.css'
import './index.css';

// 初始化 moment 时间属性
import moment from 'moment';
moment.locale('zh-CN');

//noinspection JSUnresolvedVariable
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(combineReducers({
  ...reducers,
  form: formReducer
}), composeEnhancers(
  applyMiddleware(thunkMiddleware)
))

ajax('/api/load').then(res => {
  store.dispatch({ type: actionTypes.SYSTEM_LOADED, data: res.data })
  const socket = io();

  socket.on('server:num', num => {
    store.dispatch({ type: actionTypes.ONLINE_USER_CHANGE,  data: num})
  });

  store.subscribe(() => {
    if (store.getState().outRecordsRequestStatus !== 'NEED_REQUEST') return
    if (store.getState().projects.length === 0) return

    const bases = store.getState().projects.projects.filter(project => project.type === '基地仓库')
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
    if (store.getState().inRecordsRequestStatus !== 'NEED_REQUEST') return
    if (store.getState().projects.length === 0) return

    const bases = store.getState().projects.projects.filter(project => project.type === '基地仓库')
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
        alert('出错了！获取入库数据' + JSON.stringify(err))
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
          <Route path="project/:id/edit" component={ProjectEdit}/>
          <Route path="base_store" component={BaseStore}/>
          <Route path="other_store" component={OtherStore}/>

          <Route path="article" component={Article}/>
          <Route path="purchase" component={Purchase}/>
          <Route path="transfer_in" component={TransferIn}/>
          <Route path="transfer_out" component={TransferOut}/>
          <Route path="transfer_order/:recordId" component={TransferOrder}/>
          <Route path="transfer_out/:recordId" component={TransferOutEdit}/>
          <Route path="transfer_in/:recordId" component={TransferInEdit}/>

          <Route path="transfer_in_table" component={TransferInTable} />
          <Route path="transfer_out_table" component={TransferOutTable} />
          <Route path="store" component={Store} />
        </Route>
      </Router>
    </Provider>
    ), document.getElementById('root')
  );
});
