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
import { systemLoaded, updateOnlineUser } from './actions'

import App from './App';
import Home from './Home';

import {
  Article,
  Operator,
  OperatorCreate,
  OperatorEdit,
} from './system'
import { FileManager } from './file'
import {
  Purchase,
  TransferIn,
  TransferInEdit,
  TransferOut,
  TransferOutEdit,
  TransferOrder,
  TransportOrder,
  TransportOrderEdit,
  TransferCreate,
} from './store'
import { TransferInTable, TransferOutTable, Store } from './report'
import { Project, ProjectCreate, ProjectEdit,WorkerCheckin } from './project'
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
  store.dispatch(systemLoaded(res.data))
  const socket = io();

  socket.on('server:num', num => {
    store.dispatch(updateOnlineUser(num))
  });

  ReactDOM.render((
    <Provider store={store}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="file_manager" component={FileManager}/>
            {/*劳务人员登记*/}
          <Route path="/worker_checkin" component={WorkerCheckin}/>
          <Route path="operator" component={Operator}/>
          <Route path="operator/create" component={OperatorCreate}/>
          <Route path="operator/:id/edit" component={OperatorEdit}/>

          <Route path="project" component={Project}/>
          <Route path="project_create" component={ProjectCreate}/>
          <Route path="project/:id/edit" component={ProjectEdit}/>

          <Route path="article" component={Article}/>
          <Route path="purchase" component={Purchase}/>
          <Route path="transfer/create" component={TransferCreate}/>
          <Route path="transfer_in" component={TransferIn}/>
          <Route path="transfer_out" component={TransferOut}/>
          <Route path="transfer/:recordId" component={TransferOrder}/>
          <Route path="transfer_out/:recordId" component={TransferOutEdit}/>
          <Route path="transfer_in/:recordId" component={TransferInEdit}/>

          <Route path="transport/:id" component={TransportOrder}/>
          <Route path="transport/:id/edit" component={TransportOrderEdit}/>

          <Route path="transfer_in_table" component={TransferInTable} />
          <Route path="transfer_out_table" component={TransferOutTable} />
          <Route path="store" component={Store} />
        </Route>
      </Router>
    </Provider>
    ), document.getElementById('root')
  );
});
