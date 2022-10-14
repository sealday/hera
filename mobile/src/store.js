import { configureStore, } from '@reduxjs/toolkit'
import coreReducer, { logout } from './features/coreSlices'
import { genApi } from 'hera-common'
import { setupListeners } from '@reduxjs/toolkit/query'
import { Platform } from 'react-native'

// TODO 发布后需要增加线上环境
let localhost = '127.0.0.1'
if (Platform.OS ===  'android') {
    localhost = '10.0.2.2'
}

export const heraApi = genApi({
    baseUrl: `http://${localhost}:3000/api/`,
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