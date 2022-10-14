import { configureStore, } from '@reduxjs/toolkit'
import coreReducer, { logout } from './features/coreSlices'
import { genApi } from 'hera-common'
import { setupListeners } from '@reduxjs/toolkit/query'
import { Platform } from 'react-native'

let baseUrl = 'https://shcx.shchuangxing.com/api/'
if (process.env.NODE_ENV === 'development') {
    baseUrl = 'http://127.0.0.1:3000/api/'
    if (Platform.OS === 'android') {
        // 安卓通过访问这个地址可以访问到本机的服务，否则会是虚拟机上的服务
        baseUrl = 'http://10.0.2.2:3000/api/'
    }
}

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
        [heraApi.reducerPath]: heraApi.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(heraApi.middleware),
})


setupListeners(store.dispatch)