import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../store'

// Define a type for the slice state

interface UserState {
  info:{
    "userId": string,
    "name": string,
    "mobileNumber": string,
    "lastLoginAt": null|string,
    "refreshToken": string,
    "email": string
  }|null
}

// Define the initial state using that type
const initialState: UserState = {
  info: null,
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUserInfo: (state,action:PayloadAction<UserState>) => {
      state.info = action.payload.info
    },
  },
})

export const {setUserInfo} = userSlice.actions

export default userSlice.reducer
