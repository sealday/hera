import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const initialState = {
    onlineUsers: [],
    items: [],
    active: null,
    history: [],
}

const saveTab = state => {
    localStorage.setItem('TAB', JSON.stringify({
        items: state.items,
        active: state.active,
        history: state.history
    }))
}

const coreSlice = createSlice({
    name: 'core',
    initialState,
    reducers: {
        updateOnlineUsers(state, action) {
            state.onlineUsers = action.payload
        },
        addItem(state, action) {
            const item = state.items.find(item => item.key === action.payload.key)
            if (item) {
                state.active = action.payload.key
                state.history.push(action.payload.key)
            } else {
                state.items.push(action.payload)
                state.active = action.payload.key
                state.history.push(action.payload.key)
            }
            saveTab(state)
        },
        removeItem(state, action) {
            _.remove(state.items, item => item.key === action.payload)
            _.remove(state.history, item => item === action.payload)
            state.active = _.last(state.history)
            saveTab(state)
        },
        removeAll(state) {
            _.remove(state.items, item => item)
            _.remove(state.history, item => item)
            state.active = _.last(state.history)
            saveTab(state)
        },
        changeTab(state, action) {
            state.active = action.payload
            state.history.push(action.payload)
            saveTab(state)
        },
        updateTitle(state, action) {
            const item = state.items.find(item => item.key === action.payload.key)
            item.label = action.payload.title
            saveTab(state)
        },
        loadTab(state, action) {
            state.active = action.payload.active
            state.history = action.payload.history
            state.items = action.payload.items
        }
    },
})

export const { updateOnlineUsers, addItem, changeTab, removeItem, removeAll, updateTitle, loadTab } = coreSlice.actions

export default coreSlice.reducer