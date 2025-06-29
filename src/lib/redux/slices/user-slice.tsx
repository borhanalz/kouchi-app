import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../store'
import type {IApiUserDetails} from "../../../types/user";

// Define a type for the slice state

interface UserState {
  info?:{
    "userId": string,
    "name": string,
    "mobileNumber": string,
    "lastLoginAt": null|string,
    "refreshToken": string,
    "email": string
  }|null,
  details?:IApiUserDetails["details"]|null;
}

// Define the initial state using that type
const initialState: UserState = {
  info: null,
  details:null
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUserInfo: (state,action:PayloadAction<UserState>) => {
      state.info = action.payload.info
    },
    setUserDetails: (state,action:PayloadAction<UserState>) => {
      state.details = action.payload.details
    },
  },
})

export const {setUserInfo,setUserDetails} = userSlice.actions

export default userSlice.reducer
