import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  loader: false,
};

const userNotice = createSlice({
  name: "userNotice",
  initialState,
  reducers: {
    storeNotices: (state, action) => {
      state.data = action.payload;
    },
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
  },
});

export const { storeNotices, setLoader } = userNotice.actions;
export default userNotice.reducer;
