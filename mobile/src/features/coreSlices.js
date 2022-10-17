import AsyncStorage from '@react-native-async-storage/async-storage'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  isLogined: false,
  isSelected: false,
  token: null,
}

const logout = createAsyncThunk(
  'core/logout',
  async () => {
    await AsyncStorage.removeItem('token')
  }
)

export const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogined = true
      state.token = action.payload
    },
    select: (state) => {
      state.isSelected = true
    },
    updateToken: (state, action) => {
      state.token = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state, _action) => {
      state.isLogined = false
    })
  }
})

export const { login, select, updateToken } = coreSlice.actions
export { logout }

export default coreSlice.reducer