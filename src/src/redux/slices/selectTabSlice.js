import { createSlice } from "@reduxjs/toolkit"

const initialState = ''

const selectTabSlice = createSlice({
    name: "selectTabSlice",
    initialState,
    reducers: {
        setSelectTab: (state, action) => action.payload
    }
})

export const { setSelectTab } = selectTabSlice.actions
export default selectTabSlice.reducer
