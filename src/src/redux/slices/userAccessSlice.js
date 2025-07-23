import { createSlice } from "@reduxjs/toolkit";
const initialState = {};
const userAccessSlice = createSlice({
  name: "userAccessSlice",
  initialState,
  reducers: {
    setUserAccess: (state, action) => {
        return {...action.payload };
      }
  },
});

export const { setUserAccess } = userAccessSlice.actions;
export default userAccessSlice.reducer;
