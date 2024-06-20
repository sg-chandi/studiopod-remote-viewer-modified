import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  offlineMode: "idle",
  boothDetails: {},
  authTokenModeResult: {},
  isDailyModeResult: {},
  zonesettingResult: {},
};

export const offlineReducer = createSlice({
  name: "offlineReducer",
  initialState,
  reducers: {
    setOfflineMode(state, action) {
      state.offlineMode = action.payload.offlineMode;
      state.boothDetails = action.payload.boothDetails;
      state.isDailyModeResult = action.payload.isDailyModeResult;
      state.authTokenModeResult = action.payload.authTokenModeResult;
      state.zonesettingResult = action.payload.zonesettingResult;
    },
  },
});

export const { setOfflineMode } = offlineReducer.actions;
export default offlineReducer.reducer;
