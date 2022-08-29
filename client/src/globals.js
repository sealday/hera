import { reducer as formReducer } from 'redux-form'
import { configureStore } from '@reduxjs/toolkit'
import * as reducers from './reducers'
import coreSlice from './features/coreSlice'
import { createBrowserHistory } from 'history'

export const history = createBrowserHistory()

export const store = configureStore({
    reducer: {
        ...reducers,
        core: coreSlice,
        form: formReducer,
    },
    middleware: getDefaultMiddleware => {
        if (getDefaultMiddleware().length === 3) {
            return getDefaultMiddleware().slice(1)
        } else {
            return getDefaultMiddleware()
        }
    },
})