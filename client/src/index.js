import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { Provider } from 'react-redux'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import moment from 'moment'
import 'moment/locale/zh-cn'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { ConfigProvider } from 'antd'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import io from 'socket.io-client'
import axios from 'axios'
import { history, store } from './globals'
import { systemLoaded, selectStore } from './actions'
import { updateOnlineUsers } from './features/coreSlice'
import { theme } from './utils'
import App from './pages/App'
import Home from './pages/Home'
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
  Company,
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
import Profile from './pages/Profile'
import Login from './pages/Login'
import Staff from './pages/project/staff.page'
import Attendance from './pages/project/attendance.page'
import Contract from './pages/project/contract.page'
import { ajax } from './utils'

// css 除非是模块自己的，否则直接在这里进行全局 import
import './index.less'
// 初始化 sentry
// Sentry.init({
//   release: 'hera@3.0.0',
//   dsn: "https://213cb45f8df943e0b77f89a23ee5a4e8@o374147.ingest.sentry.io/5191691"}
// )
// 初始化 moment 时间属性
moment.locale('zh-CN')
// 初始化 socket
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
  }).catch(e => {
    // 加载出错
    Sentry.captureException(e)
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
        <BrowserRouter basename='/system'>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<App onEnter={onLogined} onLeave={onLogouted} />}>
              <Route path="*" element={<Home />} />
              <Route path="dashboard" element={<Home />} />
              <Route path="operator" element={<Operator />} />
              <Route path="operator/create" element={<OperatorCreate />} />
              <Route path="operator/:id/edit" element={<OperatorEdit />} />
              <Route path="project" element={<Project />} />
              <Route path="project/create" element={<ProjectCreate />} />
              <Route path="project/:id/edit" element={<ProjectEdit />} />
              <Route path="simple_search" element={<SimpleSearch />} />
              <Route path="simple_search_company" element={<company.SimpleSearch />} />
              {/* system */}
              <Route path="product" element={<Product />} />
              <Route path="price" element={<Price />} />
              <Route path="price/create" element={<PriceCreate />} />
              <Route path="price/:id" element={<PriceEdit />} />
              <Route path="price/create/:id" element={<PriceCreate />} />
              <Route path="weight" element={<Weight />} />
              <Route path="weight/create" element={<WeightCreate />} />
              <Route path="weight/:id" element={<WeightEdit />} />
              <Route path="weight/create/:id" element={<WeightCreate />} />
              {/* direction 表示调拨的方向 取值为 in 和 out  */}
              <Route path="transfer/:direction/create" element={<TransferCreate />} />
              <Route path="transfer/:direction/:id/edit" element={<TransferEdit />} />
              <Route path="purchase/:direction/create" element={<PurchaseCreate />} />
              <Route path="purchase/:direction/:id/edit" element={<PurchaseEdit />} />
              <Route path="transfer_free/:direction/create" element={<PurchaseCreate />} />
              <Route path="transfer_free/:direction/:id/edit" element={<PurchaseEdit />} />
              <Route path="stocktaking/:direction/create" element={<StocktakingCreate />} />
              <Route path="stocktaking/:direction/:id/edit" element={<StocktakingEdit />} />
              <Route path="record/:id" element={<Record />} />
              <Route path="record/:id/preview" element={<RecordPreview />} />
              <Route path="company_record/:id" element={<company.Record />} />
              <Route path="rent_calc" element={<company.RentCalc />} />
              <Route path="rent_calc_preview" element={<company.RentCalcPreview />} />
              <Route path="contract" element={<company.Contract />} />
              <Route path="contract/create" element={<company.ContractCreate />} />
              <Route path="contract/:id" element={<company.ContractDetails />} />
              <Route path="contract/:id/calc/:calcId" element={<company.ContractDetailsCalc />} />
              <Route path="plan" element={<company.Plan />} />
              <Route path="plan/create" element={<company.PlanCreate />} />
              <Route path="transport/:id" element={<TransportOrder />} />
              <Route path="transport/:id/edit" element={<TransportOrderEdit />} />
              <Route path="store" element={<Store />} />
              <Route path="transport_table" element={<TransportSearch />} />
              <Route path="transport_table_company" element={<company.TransportSearch />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path='company' element={<Company />} />
              <Route path='staff' element={<Staff />} />
              <Route path='attendance' element={<Attendance />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </MuiThemeProvider>
  </Provider>
), document.getElementById('root'))
