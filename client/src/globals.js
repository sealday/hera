import { createHistory, useBasename as asBasename } from 'history'
import { reducer as formReducer } from 'redux-form'
import { configureStore } from '@reduxjs/toolkit'
import * as reducers from './reducers'
import coreSlice from './features/coreSlice'
import { routerReducer, routerMiddleware } from 'react-router-redux'

export const history = asBasename(createHistory)({
  basename: '/system'
})
export const store = configureStore({
    reducer: {
        ...reducers,
        core: coreSlice,
        form: formReducer,
        routing: routerReducer,
    },
    middleware: getDefaultMiddleware => {
        if (getDefaultMiddleware().length === 3) {
            return getDefaultMiddleware().slice(1).concat(routerMiddleware(history))
        } else {
            return getDefaultMiddleware().concat(routerMiddleware(history))
        }
    },
})