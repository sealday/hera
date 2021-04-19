import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    onlineUsers: [],
}

const coreSlice = createSlice({
    name: 'core',
    initialState,
    reducers: {
        updateOnlineUsers(state, action) {
            state.onlineUsers = action.payload
        },
    },
})

export const { updateOnlineUsers } = coreSlice.actions

export default coreSlice.reducer