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
    login: (state) => {
      state.isLogined = true
    },
    logout: (state) => {
      state.isLogined = false
    },
    select: (state) => {
      state.isSelected = true
    },
    updateToken: (state, data) => {
      state.token = data.payload
    }
  },
})

export const { login, select, logout, updateToken } = coreSlice.actions

export default coreSlice.reducer