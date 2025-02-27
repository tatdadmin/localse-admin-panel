import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userAuth from "./slices/userAuthSlice";
import { thunk } from "redux-thunk";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";
import NoticeSlice from "./slices/NoticeSlice";
const rootReducer = combineReducers({
  userAuth,
  NoticeSlice
});

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["userAuth"],
  blacklist:['NoticeSlice']
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
