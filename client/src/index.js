import 'scroll-polyfill/auto'
import React from 'react'
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
import { updateOnlineUsers } from './features/coreSlice'
import { ajax } from './utils'
import Routes from './routes'

// css 除非是模块自己的，否则直接在这里进行全局 import
import './index.less'
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
    <ConfigProvider locale={zh_CN} renderEmpty={emptyRenderer}>
      <Alert.ErrorBoundary>
        <HistoryRouter history={history} basename={BASENAME}>
          <Routes onLogin={onLogined} onLogout={onLogouted} />
        </HistoryRouter>
      </Alert.ErrorBoundary>
    </ConfigProvider>
  </Provider>
)
// react 18 之后用法
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<MyApp />)
