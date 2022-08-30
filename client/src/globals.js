import { reducer as formReducer } from 'redux-form'
import { configureStore } from '@reduxjs/toolkit'
import * as reducers from './reducers'
import coreSlice from './features/coreSlice'
import { createBrowserHistory } from 'history'
import { setupListeners } from '@reduxjs/toolkit/query'
import { heraApi } from './api'

export const history = createBrowserHistory()

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