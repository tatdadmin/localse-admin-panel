import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userAuth from "./slices/userAuthSlice";
import globalSlice from "./slices/globalSlice";
import { thunk } from "redux-thunk";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  userAuth,
  globalSlice,
});

const persistConfig = {
  key: "root",
  storage: storage,
  blacklist: ["trustedDriverSlice"],
  whitelist: ["globalSlice", "userAuth"],
};

const persistedreducer = persistReducer(persistConfig, rootReducer);
const middleware = [thunk];

const store = configureStore({
  reducer: persistedreducer,
  middleware: () => [...middleware],
});

export default store;
