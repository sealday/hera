import _ from 'lodash'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { baseUrl } from '../constants'
import { useEffect } from 'react'

const reducerPath = 'api'

const fetchLatestOperations = createAsyncThunk(
    'operations/fetchLatest',
    async (_, thunkAPI) => {
        const response = await fetch(baseUrl + 'operation/top_k', {
            headers: {
                'Authorization': `Bearer ${thunkAPI.getState().core.token}`,
            }
        })
        const res = await response.json()
        return res.data.operations
    }
)

const fetchMoreOperations = createAsyncThunk(
    'operations/fetchMore',
    async (id, thunkAPI) => {
        const response = await fetch(baseUrl + `operation/next_k?id=${id}`, {
            headers: {
                'Authorization': `Bearer ${thunkAPI.getState().core.token}`
            }
        })
        const res = await response.json()
        return res.data.operations
    }
)

const apiSlice = createSlice({
    name: 'api',
    initialState: { 
        operations: [], 
        loading: {
            [fetchLatestOperations.typePrefix]: 'idle',
            [fetchMoreOperations.typePrefix]: 'idle',
        },
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLatestOperations.pending, (state, action) => {
                state.loading[fetchLatestOperations.typePrefix] = 'loading'
            })
            .addCase(fetchMoreOperations.pending, (state, action) => {
                state.loading[fetchMoreOperations.typePrefix] = 'loading'
            })
            .addCase(fetchLatestOperations.fulfilled, (state, action) => {
                state.operations = action.payload
                state.loading[fetchLatestOperations.typePrefix] = 'idle'
            })
            .addCase(fetchMoreOperations.fulfilled, (state, action) => {
                state.operations.push(...action.payload)
                state.loading[fetchMoreOperations.typePrefix] = 'idle'
            })
            .addCase(fetchLatestOperations.rejected, (state, action) => {
                state.loading[fetchLatestOperations.typePrefix] = 'error'
            })
            .addCase(fetchMoreOperations.rejected, (state, action) => {
                state.loading[fetchMoreOperations.typePrefix] = 'error'
            })
    }
})

const useGetOperations = () => {
    const data = useSelector(state => state[reducerPath].operations)
    const dispatch = useDispatch()
    const isRefreshing = useSelector(state => state[reducerPath].loading[fetchLatestOperations.typePrefix] === 'loading')
    const isLoading = useSelector(state => state[reducerPath].loading[fetchMoreOperations.typePrefix] === 'loading')
    const isError = useSelector(state => state[reducerPath].loading[fetchLatestOperations.typePrefix] === 'error')
    useEffect(() => {
        if (data.length === 0) {
            refresh()
        }
    }, [data, isError])
    const refresh = () => {
        if (!isRefreshing) {
            dispatch(fetchLatestOperations())
        }
    }
    const loadMore = () => {
        if (!isRefreshing && !isLoading && data.length !== 0) {
            dispatch(fetchMoreOperations(_.last(data)._id))
        }
    }
    return { data, isRefreshing, isLoading, isError, refresh, loadMore }
}

const api = { 
    reducerPath, 
    reducer: apiSlice.reducer,
    useGetOperations,
}

export default api