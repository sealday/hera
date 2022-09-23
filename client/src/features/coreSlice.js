import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const initialState = {
    onlineUsers: [],
    items: [],
    active: 'default',
    history: ['default'],
}

const coreSlice = createSlice({
    name: 'core',
    initialState,
    reducers: {
        updateOnlineUsers(state, action) {
            state.onlineUsers = action.payload
        },
        addItem(state, action) {
            state.items.push(action.payload)
            state.active = action.payload.key
            state.history.push(action.payload.key)
        },
        removeItem(state, action) {
            _.remove(state.items, item => action.payload === item.key)
            _.remove(state.history, item => item === action.payload)
            state.active = _.last(state.history)
        },
        changeTab(state, action) {
            state.active = action.payload
            state.history.push(action.payload)
        },
        updateTitle(state, action) {
            const item = state.items.find(item => item.key === action.payload.key)
            item.label = action.payload.title
        }
    },
})

export const { updateOnlineUsers, addItem, changeTab, removeItem, updateTitle } = coreSlice.actions

export default coreSlice.reducer