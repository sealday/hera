// 使用 bluebird 的 promise 实现
// TODO 需要测试下实际中浏览器的兼容性
import './before'
import 'bluebird';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { reducer as formReducer } from 'redux-form'
import { Provider } from 'react-redux'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import msgpack5 from 'msgpack5'
import { PersistGate } from 'redux-persist/integration/react'
import * as reducers from './reducers'
import { systemLoaded, updateOnlineUser, updateOnlineUsers, selectStore } from './actions'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import { Profile } from './components'
import config from './config'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { theme } from './utils'

import App from './App';
import Home from './Home';
import {
  AccountVoucherInput,
  PayCheck
} from './finance'

import {
  Operator,
  OperatorCreate,
  OperatorEdit,
  Project,
  ProjectCreate,
  ProjectEdit,
  Product,
  Price,
  PriceEdit,
  PriceCreate,
  Supplier,
} from './system'

import {
  Record,
  RecordPreview,
  TransportOrder,
  TransportOrderEdit,
  TransferCreate,
  TransferEdit,

  PurchaseCreate, // 采购创建
  PurchaseEdit, // 采购编辑

  StocktakingCreate,
  StocktakingEdit,
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

  StocktakingOutTable,
  StocktakingInTable,
} from './report'

import * as company from './company'

import {
  WorkerCheckin,
  WorkerCheckinEdit,
    Signin,
    DisplaySignin,
} from './project'

import {
  Router,
  Route,
  hashHistory,
  IndexRedirect,
  Redirect,
} from 'react-router';

import { ajax } from './utils';
import io from 'socket.io-client';

// css 除非是模块自己的，否则直接在这里进行全局 import
import 'bootstrap/dist/css/bootstrap.css';
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'animate.css'
import './index.css';

// 初始化 moment 时间属性
import moment from 'moment';
moment.locale('zh-CN');

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;

// 处理 moment 类型的转换
const msgpack = msgpack5()
const { encode, decode } = msgpack
msgpack.register(0x42, moment, (m) => encode(m.toDate()), (buf) => moment(decode(buf)))
const myTransform = createTransform(
  inboundState => encode(inboundState),
  outboundState => decode(outboundState),
);

const persistConfig = {
  key: 'form-6',
  transforms: [myTransform],
  storage,
}

const store = createStore(combineReducers({
  ...reducers,
  form: persistReducer(persistConfig, formReducer),
  routing: routerReducer,
}), composeEnhancers(
  applyMiddleware(thunkMiddleware, routerMiddleware(hashHistory))
))

const persistor = persistStore(store)

ajax('/api/load').then(res => {
  store.dispatch(systemLoaded(res.data))
  const socket = io();

  socket.on('server:num', num => {
    store.dispatch(updateOnlineUser(num))
  });

  socket.on('server:users', (users) => {
    store.dispatch(updateOnlineUsers(users))
  });

  socket.on('connect', () => {
    socket.emit('client:user', res.data.user)
  })

  global.socket = socket

  try {
    const store_ = JSON.parse(localStorage.getItem(`store-${ config.db }`))
    console.log(`store-${ config.db }`)
    store.dispatch(selectStore(store_))
  } catch (e) {
    console.warn(e);
  }

  ReactDOM.render((
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MuiThemeProvider theme={theme}>
        <Router history={syncHistoryWithStore(hashHistory, store)}>
          <Route path="/" component={App}>
            <IndexRedirect to="/dashboard"/>
            <Route path="dashboard" component={Home}/>
            {/*劳务人员登记*/}
            <Route path="worker/create" component={WorkerCheckin}/>
            <Route path="worker/:id/edit" component={WorkerCheckinEdit}/>
            {/*进场工人签到*/}
            <Route path="signin" component={Signin}/>
            {/*进场工人签到展示*/}
            <Route path="signin/check" component={DisplaySignin}/>
            <Route path="operator" component={Operator}/>
            <Route path="operator/create" component={OperatorCreate}/>
            <Route path="operator/:id/edit" component={OperatorEdit}/>

            <Route path="project" component={Project}/>
            <Route path="project/create" component={ProjectCreate}/>
            <Route path="project/:id/edit" component={ProjectEdit}/>

            <Route path="supplier" component={Supplier} />

            <Route path="search" component={Search}/>
            <Route path="simple_search" component={SimpleSearch}/>
            <Route path="simple_search_company" component={company.SimpleSearch}/>
            <Route path="product" component={Product} />
            <Route path="price" component={Price} />
            <Route path="price/create" component={PriceCreate} />
            <Route path="price/:id" component={PriceEdit} />
            <Route path="price/create/:id" component={PriceCreate} />

            {/* direction 表示调拨的方向 取值为 in 和 out  */}
            <Route path="transfer/:direction/create" component={TransferCreate}/>
            <Route path="transfer/:direction/:id/edit" component={TransferEdit}/>
            <Route path="purchase/:direction/create" component={PurchaseCreate}/>
            <Route path="purchase/:direction/:id/edit" component={PurchaseEdit}/>
            <Route path="stocktaking/:direction/create" component={StocktakingCreate}/>
            <Route path="stocktaking/:direction/:id/edit" component={StocktakingEdit}/>

            <Route path="record/:id" component={Record}/>
            <Route path="record/:id/preview" component={RecordPreview}/>
            <Route path="company_record/:id" component={company.Record}/>
            <Route path="rent_calc" component={company.RentCalc}/>
            <Route path="contract" component={company.Contract}/>
            <Route path="contract/:id" component={company.ContractContent}/>

            <Route path="transport/:id" component={TransportOrder}/>
            <Route path="transport/:id/edit" component={TransportOrderEdit}/>

            <Route path="transfer_in_table" component={TransferInTable} />
            <Route path="transfer_out_table" component={TransferOutTable} />
            <Route path="purchase_table" component={PurchaseTable} />
            <Route path="sell_table" component={SellTable} />
            <Route path="store" component={Store} />
            <Route path="transport_table" component={TransportSearch}/>
            <Route path="transport_table_company" component={company.TransportSearch}/>
            <Route path="stocktaking_out_table" component={StocktakingOutTable}/>
            <Route path="stocktaking_in_table" component={StocktakingInTable}/>

            {/*记账凭证输入*/}
            <Route path="accuntvoucher/input" component={AccountVoucherInput}/>
            {/*应付查询*/}
            <Route path="finance/payable" component={PayCheck}/>
            <Route path="profile" component={Profile}/>
            <Redirect path="*" to="/dashboard"/>
          </Route>
        </Router>
        </MuiThemeProvider>
      </PersistGate>
    </Provider>
    ), document.getElementById('root')
  );
});
