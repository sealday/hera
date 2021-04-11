import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { reducer as formReducer } from 'redux-form'
import { Provider } from 'react-redux'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import moment from 'moment'
import 'moment/locale/zh-cn'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { ConfigProvider } from 'antd'
import {
  Router,
  Route,
  hashHistory,
  IndexRedirect,
  Redirect,
} from 'react-router'
import io from 'socket.io-client'
import axios from 'axios'

import * as reducers from './reducers'
import { systemLoaded, updateOnlineUsers, selectStore } from './actions'
import { Profile } from './components'
import { theme } from './utils'
import App from './App'
import Home from './Home'
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
  Settings,
  Weight,
  WeightEdit,
  WeightCreate,
} from './system'
import {
  Record,
  RecordPreview,
  TransportOrder,
  TransportOrderEdit,
  TransferCreate,
  TransferEdit,
  PurchaseCreate,
  PurchaseEdit,
  StocktakingCreate,
  StocktakingEdit,
} from './store'
import {
  Store,
  SimpleSearch,
  TransportSearch,
} from './report'
import * as company from './company'
import Login from './Login'
import { ajax } from './utils'

// css 除非是模块自己的，否则直接在这里进行全局 import
import './index.css'

// 初始化 sentry
Sentry.init({
  release: 'hera@3.0.0',
  dsn: "https://213cb45f8df943e0b77f89a23ee5a4e8@o374147.ingest.sentry.io/5191691"}
)

// 初始化 moment 时间属性
moment.locale('zh-CN')

// 启用 REDUX DEVTOOLS，可以在谷歌等浏览器上安装相应插件
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose

const store = createStore(combineReducers({
  ...reducers,
  form: formReducer,
  routing: routerReducer,
}), composeEnhancers(
  applyMiddleware(thunkMiddleware, routerMiddleware(hashHistory))
))

const socket = io()

socket.on('server:users', (users) => {
  store.dispatch(updateOnlineUsers(users))
})

const onLogined = () => {
  const token = localStorage.getItem('X-Hera-Token')
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  ajax('/api/load').then(res => {
    store.dispatch(systemLoaded(res.data))

    socket.on('connect', () => {
      socket.emit('client:user', { 
        user: res.data.user,
        token: token,
      })
    })
    if (socket.connected) {
      socket.emit('client:user', { 
        user: res.data.user,
        token: token,
      })
    }

    const config = res.data.config
    try {
      const store_ = JSON.parse(localStorage.getItem(`store-${config.db}`))
      if ('_id' in store_) {
        // 简单验证是否为有效的仓库信息
        store.dispatch(selectStore(config, store_))
      }
    } catch (e) { }

  })
}

const onLogouted = () => {
  socket.off('connect')
  if (socket.connected) {
    socket.emit('client:logout')
  }
}

ReactDOM.render((
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
    <ConfigProvider locale={zh_CN}>
      <Router history={syncHistoryWithStore(hashHistory, store)}>
        <Route path="/login" component={Login} />
        <Route path="/" component={App} onEnter={onLogined} onLeave={onLogouted}>
          <IndexRedirect to="/dashboard" />
          <Route path="dashboard" component={Home} />
          <Route path="operator" component={Operator} />
          <Route path="operator/create" component={OperatorCreate} />
          <Route path="operator/:id/edit" component={OperatorEdit} />
          <Route path="project" component={Project} />
          <Route path="project/create" component={ProjectCreate} />
          <Route path="project/:id/edit" component={ProjectEdit} />
          <Route path="simple_search" component={SimpleSearch} />
          <Route path="simple_search_company" component={company.SimpleSearch} />
          {/* system */}
          <Route path="product" component={Product} />
          <Route path="price" component={Price} />
          <Route path="price/create" component={PriceCreate} />
          <Route path="price/:id" component={PriceEdit} />
          <Route path="price/create/:id" component={PriceCreate} />
          <Route path="weight" component={Weight} />
          <Route path="weight/create" component={WeightCreate} />
          <Route path="weight/:id" component={WeightEdit} />
          <Route path="weight/create/:id" component={WeightCreate} />
          {/* direction 表示调拨的方向 取值为 in 和 out  */}
          <Route path="transfer/:direction/create" component={TransferCreate} />
          <Route path="transfer/:direction/:id/edit" component={TransferEdit} />
          <Route path="purchase/:direction/create" component={PurchaseCreate} />
          <Route path="purchase/:direction/:id/edit" component={PurchaseEdit} />
          <Route path="transfer_free/:direction/create" component={PurchaseCreate} />
          <Route path="transfer_free/:direction/:id/edit" component={PurchaseEdit} />
          <Route path="stocktaking/:direction/create" component={StocktakingCreate} />
          <Route path="stocktaking/:direction/:id/edit" component={StocktakingEdit} />
          <Route path="record/:id" component={Record} />
          <Route path="record/:id/preview" component={RecordPreview} />
          <Route path="company_record/:id" component={company.Record} />
          <Route path="rent_calc" component={company.RentCalc} />
          <Route path="rent_calc_preview" component={company.RentCalcPreview} />
          <Route path="contract" component={company.Contract} />
          <Route path="contract/create" component={company.ContractCreate} />
          <Route path="contract/:id" component={company.ContractDetails} />
          <Route path="contract/:id/calc/:calcId" component={company.ContractDetailsCalc} />
          <Route path="transport/:id" component={TransportOrder} />
          <Route path="transport/:id/edit" component={TransportOrderEdit} />
          <Route path="store" component={Store} />
          <Route path="transport_table" component={TransportSearch} />
          <Route path="transport_table_company" component={company.TransportSearch} />
          <Route path="profile" component={Profile} />
          <Route path="settings" component={Settings} />
          <Redirect path="*" to="/dashboard" />
        </Route>
      </Router>
    </ConfigProvider>
    </MuiThemeProvider>
  </Provider>
), document.getElementById('root'))
