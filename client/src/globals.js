import { reducer as formReducer } from 'redux-form'
import { configureStore, isRejectedWithValue } from '@reduxjs/toolkit'
import * as reducers from './reducers'
import coreSlice from './features/coreSlice'
import { createBrowserHistory } from 'history'
import { setupListeners } from '@reduxjs/toolkit/query'
import { heraApi } from './api'

export const BASENAME = '/system'

export const history = createBrowserHistory()

export const RECORD_TYPE_MAP = {
    'purchase': '购销',
    'rent': '调拨',
    'check': '盘点',
    'transfer': '暂存',
}

const rtkQueryErrorLogger = (api) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.warn('We got a rejected action!')
      console.warn(action)
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
        return getDefaultMiddleware().concat(heraApi.middleware).concat(rtkQueryErrorLogger)
    },
})

setupListeners(store.dispatch)