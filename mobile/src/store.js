import { configureStore, } from '@reduxjs/toolkit'
import coreReducer, { logout } from './features/coreSlices'
import api from './features/apiSlices'
import { genApi } from 'hera-common'
import { setupListeners } from '@reduxjs/toolkit/query'
import { baseUrl } from './constants'

export const heraApi = genApi({
    baseUrl,
    onLogin: () => {
        store.dispatch(logout())
    },
    getAuthToken: () => store.getState().core.token,
})

export const store = configureStore({
    reducer: {
        core: coreReducer,
        [api.reducerPath]: api.reducer,
        [heraApi.reducerPath]: heraApi.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(heraApi.middleware),
})


setupListeners(store.dispatch)