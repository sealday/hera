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
import { systemLoaded, updateOnlineUser, selectStore } from './actions'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'

import App from './App';
import Home from './Home';

import {
  Article,
  Operator,
  OperatorCreate,
  OperatorEdit,
  Project,
  ProjectCreate,
  ProjectEdit,
} from './system'

import {
  FileManager
} from './file'

import {
  Purchase,
  Record,
  TransportOrder,
  TransportOrderEdit,
  TransferCreate,
  TransferEdit,

  PurchaseCreate, // 采购创建
  PurchaseEdit, // 采购编辑
  PurchaseOrder, // 采购查看
} from './store'

import {
  TransferInTable,
  TransferOutTable,
  PurchaseTable,
  SellTable,
  Store,
  Search,
  SimpleSearch,
  TransportSearch,
} from './report'

import {
  WorkerCheckin,
  WorkerCheckinEdit
} from './project'

import {
  Router,
  Route,
  IndexRoute,
  hashHistory
} from 'react-router';

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

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;

const store = createStore(combineReducers({
  ...reducers,
  form: formReducer,
  routing: routerReducer,
}), composeEnhancers(
  applyMiddleware(thunkMiddleware, routerMiddleware(hashHistory))
))

ajax('/api/load').then(res => {
  store.dispatch(systemLoaded(res.data))
  const socket = io();

  socket.on('server:num', num => {
    store.dispatch(updateOnlineUser(num))
  });

  const store_ = JSON.parse(localStorage.getItem('store'))
  if (store_) {
    store.dispatch(selectStore(store_))
  }

  ReactDOM.render((
    <Provider store={store}>
      <Router history={syncHistoryWithStore(hashHistory, store)}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="file_manager" component={FileManager}/>
            {/*劳务人员登记*/}
          <Route path="worker/create" component={WorkerCheckin}/>
          <Route path="worker/:id/edit" component={WorkerCheckinEdit}/>

          <Route path="operator" component={Operator}/>
          <Route path="operator/create" component={OperatorCreate}/>
          <Route path="operator/:id/edit" component={OperatorEdit}/>

          <Route path="project" component={Project}/>
          <Route path="project/create" component={ProjectCreate}/>
          <Route path="project/:id/edit" component={ProjectEdit}/>

          <Route path="search" component={Search}/>
          <Route path="simple_search" component={SimpleSearch}/>
          <Route path="article" component={Article}/>
          <Route path="purchase" component={Purchase}/>

          {/* direction 表示调拨的方向 取值为 in 和 out  */}
          <Route path="transfer/:direction/create" component={TransferCreate}/>
          <Route path="transfer/:direction/:id/edit" component={TransferEdit}/>
          <Route path="purchase/:direction/create" component={PurchaseCreate}/>
          <Route path="purchase/:direction/:id/edit" component={PurchaseEdit}/>

          <Route path="record/:id" component={Record}/>

          <Route path="transport/:id" component={TransportOrder}/>
          <Route path="transport/:id/edit" component={TransportOrderEdit}/>

          <Route path="transfer_in_table" component={TransferInTable} />
          <Route path="transfer_out_table" component={TransferOutTable} />
          <Route path="purchase_table" component={PurchaseTable} />
          <Route path="sell_table" component={SellTable} />
          <Route path="store" component={Store} />
          <Route path="transport_table" component={TransportSearch}/>
        </Route>
      </Router>
    </Provider>
    ), document.getElementById('root')
  );
});
