import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userAuth from "./slices/userAuthSlice";
import { thunk } from "redux-thunk";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  userAuth,
});

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["userAuth"],
};

const persistedreducer = persistReducer(persistConfig, rootReducer);
const middleware = [thunk];

const store = configureStore({
  reducer: persistedreducer,
  middleware: () => [...middleware],
});

export default store;
