import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userAuth from "./slices/userAuthSlice";
import { thunk } from "redux-thunk";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";
import NoticeSlice from "./slices/NoticeSlice";
import selectTabSlice from "./slices/selectTabSlice";
import userAccessSlice from './slices/userAuthSlice'
const rootReducer = combineReducers({
  userAuth,
  NoticeSlice,
  selectTabSlice,
  userAccessSlice,

});

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["userAuth","selectTabSlice"],
  blacklist: ["NoticeSlice","userAccessSlice"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middleware = [thunk];

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(middleware),
});

export const persistor = persistStore(store);
export default store;
