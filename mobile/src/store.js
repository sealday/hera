import { configureStore, } from '@reduxjs/toolkit'
import coreReducer, { logout } from './features/coreSlices'
import { genApi } from 'hera-common'
import { setupListeners } from '@reduxjs/toolkit/query'

export const heraApi = genApi({
    baseUrl: 'http://127.0.0.1:3000/api/',
    onLogin: () => {
        store.dispatch(logout())
    },
    getAuthToken: () => store.getState().core.token,
})

export const store = configureStore({
    reducer: {
        core: coreReducer,
        [heraApi.reducerPath]: heraApi.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(heraApi.middleware),
})


setupListeners(store.dispatch)