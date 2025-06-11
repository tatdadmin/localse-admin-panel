import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jwt: localStorage.getItem("jwt") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  login: localStorage.getItem("jwt") ? true : false,
  userAllData:null
};

const userAuth = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUserAuthStates: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
      localStorage.setItem(key, value);
    },
    logoutUser: (state) => {
      state.jwt = null;
      state.refreshToken = null;
      state.userAllData=null
      state.login = false;
      localStorage.removeItem("jwt");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setUserAuthStates, logoutUser } = userAuth.actions;
export default userAuth.reducer;
