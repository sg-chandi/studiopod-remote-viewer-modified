import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: {
    boothEmail: null,
    boothUserId: null,
    token: null,
    loggedIn: false,
  },
  info: {
    boothName: null,
    boothId: null,
    isDailyMode: false,
    isClubMode: false,
  },
  activity: {
    lastActive: 0,
    isInactive: false,
    isCameraConnected: true,
    loading: false,
    hasInterConnection: true,
  },
  error: {
    hasError: false,
    errorName: "",
    error: null,
  },
};

export const boothInfo = createSlice({
  name: "booth",
  initialState,
  reducers: {
    setBoothAuth: (state, { payload }) => {
      state.auth = payload;
    },
    setBoothInfo: (state, { payload }) => {
      state.info = payload;
    },
    setBoothMode: (state, { payload }) => {
      state.info.isDailyMode = payload.isDailyMode;
      state.info.isClubMode = payload.isClubMode;
    },
    setBoothActivity: (state, { payload }) => {
      state.activity = { ...state.activity, ...payload };
    },
    setBoothError: (state, { payload }) => {
      state.error = payload;
    },
    setLoading: (state, { payload }) => {
      state.activity.loading = payload;
    },
    resetBooth: (state) => {
      state = initialState;
    },
  },
});

export const {
  setBoothAuth,
  setBoothInfo,
  resetBooth,
  setBoothMode,
  setBoothError,
  setBoothActivity,
  setLoading,
} = boothInfo.actions;
export default boothInfo.reducer;
