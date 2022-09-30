import { configureStore } from '@reduxjs/toolkit'
import coreReducer from './features/coreSlices'

export const store = configureStore({
    reducer: {
        core: coreReducer,
    }
})