import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLogined: false,
  isSelected: false,
}

export const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    login: (state) => {
      state.isLogined = true
    },
    select: (state) => {
      state.isSelected = true
    },
  },
})

export const { login, select } = coreSlice.actions

export default coreSlice.reducer