// src/redux/slices/globalSlice.js

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  languageSwitch: 'english',
  currentView: 'English',
  ticketsData: [],
  faqData: [],
  rating: 0,
  buttonShow: false,
  showButtonText: '',
  storedRating: 0,
  notificationData: [],
  refreshData: false,
  triggerFunction: false,
  loginStatus: false,
  refreshKey: 0,
  driverConsentData: null,
};

const globalSlice = createSlice({
  name: 'globalState',
  initialState,
  reducers: {
    // Update a specific state key dynamically
    setGlobalState: (state, action) => {
      const {key, value} = action.payload;
      if (state.hasOwnProperty(key)) {
        state[key] = value;
      }
    },

    // Actions for specific state updates
    setLanguageSwitch: (state, action) => {
      state.languageSwitch = action.payload;
    },
    setTicketsData: (state, action) => {
      state.ticketsData = action.payload;
    },
    setFaqData: (state, action) => {
      state.faqData = action.payload;
    },
    setRating: (state, action) => {
      state.rating = action.payload;
    },
    setButtonShow: (state, action) => {
      state.buttonShow = action.payload;
    },
    setShowButtonText: (state, action) => {
      state.showButtonText = action.payload;
    },
    setStoredRating: (state, action) => {
      state.storedRating = action.payload;
    },
    setNotificationData: (state, action) => {
      state.notificationData = action.payload;
    },
    setRefreshData: (state, action) => {
      state.refreshData = action.payload;
    },
    setTriggerFunction: (state, action) => {
      state.triggerFunction = action.payload;
    },
    setLoginStatus: (state, action) => {
      state.loginStatus = action.payload;
    },
    setRefreshKey: state => {
      state.refreshKey += 1;
    },
    setDriverConsentData: (state, action) => {
      state.driverConsentData = action.payload;
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
  },
});

export const {
  setGlobalState,
  setLanguageSwitch,
  setTicketsData,
  setFaqData,
  setRating,
  setButtonShow,
  setShowButtonText,
  setStoredRating,
  setNotificationData,
  setRefreshData,
  setTriggerFunction,
  setLoginStatus,
  setRefreshKey,
  setDriverConsentData,
  setCurrentView,
} = globalSlice.actions;

export default globalSlice.reducer;
