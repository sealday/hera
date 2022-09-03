import { reducer as formReducer } from 'redux-form'
import { configureStore, isRejectedWithValue } from '@reduxjs/toolkit'
import * as reducers from './reducers'
import coreSlice from './features/coreSlice'
import { createBrowserHistory } from 'history'
import { setupListeners } from '@reduxjs/toolkit/query'
import { heraApi } from './api'
import { message } from 'antd'

export const BASENAME = '/system'

export const history = createBrowserHistory()

const rtkQueryErrorLogger = (api) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.warn('We got a rejected action!')
      message.warn(action.error.data.message)
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
        if (getDefaultMiddleware().length === 3) {
            return getDefaultMiddleware().slice(1).concat(heraApi.middleware)
        } else {
            return getDefaultMiddleware().concat(heraApi.middleware)
        }
    },
})

setupListeners(store.dispatch)