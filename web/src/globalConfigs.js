import { reducer as formReducer } from 'redux-form'
import { configureStore, isFulfilled, isPending, isRejectedWithValue } from '@reduxjs/toolkit'
import * as reducers from './reducers'
import coreSlice from './features/coreSlice'
import { createBrowserHistory } from 'history'
import { setupListeners } from '@reduxjs/toolkit/query'
import heraApi from './api'
import _ from 'lodash'
import { message } from 'antd'
import { createContext } from 'react'

export const BASENAME = '/system'

export const history = createBrowserHistory()

export const RECORD_TYPE_MAP = {
  'purchase': '购销',
  'rent': '调拨',
  'check': '盘点',
  'transfer': '暂存',
}

export const TabContext = createContext({
  params: {},
  key: '',
  has: false,
})

export const ModalContext = createContext({
  has: false,
})

const rtkQueryErrorLogger = (api) => (next) => (action) => {
  // 跳过登入、登出行为
  const endpointName = _.get(action, 'meta.arg.endpointName')
  if (endpointName === 'login' || endpointName === 'logout') {
    return next(action)
  }
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    console.warn('We got a rejected action!')
    console.warn('isRejected', action)
    const requestId = _.get(action, 'meta.requestId')
    if (requestId) {
      if (_.includes(action.type, 'executeQuery')) {
        message.error({ content: '查询失败！', key: requestId })
      } else if (_.includes(action.type, 'executeMutation')) {
        message.error({ content: '操作失败！', key: requestId })
      }
    }
  }

  if (isPending(action)) {
    // TODO 这里可以记录请求记录
    const requestId = _.get(action, 'meta.requestId')
    if (requestId) {
      if (_.includes(action.type, 'executeQuery')) {
        message.loading({ content: '努力查询中...', key: requestId })
      } else if (_.includes(action.type, 'executeMutation')) {
        message.loading({ content: '执行操作中...', key: requestId })
      }
    }
    console.log('isPeding', action)
  }
  
  if (isFulfilled(action)) {
    // TODO 这里可以记录成功
    const requestId = _.get(action, 'meta.requestId')
    if (requestId) {
      if (_.includes(action.type, 'executeQuery')) {
        message.success({ content: '查询成功', key: requestId })
      } else if (_.includes(action.type, 'executeMutation')) {
        message.success({ content: '操作成功', key: requestId })
      }
    }
  }

  return next(action)
}

export const store = configureStore({
  reducer: {
    ...reducers,
    core: coreSlice,
    [heraApi.reducerPath]: heraApi.reducer,
    form: formReducer,
  },
  middleware: getDefaultMiddleware => {
    // 参考 https://stackoverflow.com/questions/65217815/redux-handling-really-large-state-object
    // 禁用检查，需要的时候可以单独启用
    const middlewares = getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    })
    return middlewares.concat([heraApi.middleware, rtkQueryErrorLogger])
  },
})

setupListeners(store.dispatch)