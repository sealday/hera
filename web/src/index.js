import 'scroll-polyfill/auto'
import React from 'react'
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import moment from 'moment'
import 'moment/locale/zh-cn'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { Alert, ConfigProvider } from 'antd'
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import io from 'socket.io-client'
import axios from 'axios'
import { store, history, BASENAME } from './globalConfigs'
import { systemLoaded, selectStore } from './actions'
import { loadTab, updateOnlineUsers } from './features/coreSlice'
import { ajax, getAuthToken } from './utils'
import Routes from './routes'
import { HelmetProvider } from 'react-helmet-async'
// css 除非是模块自己的，否则直接在这里进行全局 import
import './index.less'
import heraApi from 'api'
import _ from 'lodash'
const versionInfo = require("./version.json")
const { versionNumber } = versionInfo || {}

Sentry.init({
  dsn: "http://8c252be29e9049a19515c4d76ec398e0@xp.sealday.com:9000/2",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1,
  release: versionNumber,
});
// 初始化 moment 时间属性
moment.locale('zh-CN')
// 初始化 socket
const socket = io()
socket.on('server:users', (users) => {
  store.dispatch(updateOnlineUsers(users))
})
socket.on('server:update', (body) => {
  // TODO 排除本身
  if (body.type === 'create') {
    store.dispatch(heraApi.util.invalidateTags([{ type: _.capitalize(body.name), id: 'LIST' }]))
  } else {
    store.dispatch(heraApi.util.invalidateTags([{ type: _.capitalize(body.name), id: body.id }]))
  }
})
const onLogined = () => {
  const token = getAuthToken()
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  ajax('/api/load').then(res => {
    store.dispatch(systemLoaded(res.data))
    
    const tabContent = localStorage.getItem('TAB')
    if (process.env.NODE_ENV === 'development' && tabContent) {
      const tabInfo = JSON.parse(tabContent)
      store.dispatch(loadTab({ ...tabInfo }))
    }

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
  })
}
const onLogouted = () => {
  socket.off('connect')
  if (socket.connected) {
    socket.emit('client:logout')
  }
}
const emptyRenderer = () => (
  <div></div>
)
const MyApp = () => (
  <Provider store={store}>
    <HelmetProvider context={{}}>
      <ConfigProvider locale={zh_CN} renderEmpty={emptyRenderer}>
        <Alert.ErrorBoundary>
          <HistoryRouter history={history} basename={BASENAME}>
            <Routes onLogin={onLogined} onLogout={onLogouted} />
          </HistoryRouter>
        </Alert.ErrorBoundary>
      </ConfigProvider>
    </HelmetProvider>
  </Provider>
)
// react 18 之后用法
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<MyApp />)
