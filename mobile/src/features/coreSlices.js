import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLogined: false,
  isSelected: false,
  token: null,
}

export const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogined = true
      state.token = action.payload
    },
    logout: (state) => {
      state.isLogined = false
    },
    select: (state) => {
      state.isSelected = true
    },
    updateToken: (state, action) => {
      state.token = action.payload
    }
  },
})

export const { login, select, logout, updateToken } = coreSlice.actions

export default coreSlice.reducer