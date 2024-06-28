import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  offlineMode: localStorage.getItem('mode') ?localStorage.getItem('mode'): "online",
  authToken:localStorage.getItem('authToken') ?localStorage.getItem('authToken'):null,
  boothDetails: localStorage.getItem('boothDetails') ?localStorage.getItem('boothDetails'):{},
  authTokenModeResult: localStorage.getItem('authTokenModeResult') ?localStorage.getItem('authTokenModeResult'):{},
  isDailyModeResult: localStorage.getItem('isDailyModeResult') ?localStorage.getItem('isDailyModeResult'):{},
  zonesettingResult: localStorage.getItem('zonesettingResult') ?localStorage.getItem('zonesettingResult'):{},
};

export const offlineReducer = createSlice({
  name: "offlineReducer",
  initialState,
  reducers: {
    setAuthToken(state, {payload}) {
      state.authToken = payload
      localStorage.setItem('authToken',JSON.stringify(payload))
    },
    setOfflineMode(state, action) {
      state.offlineMode = action.payload.offlineMode;
      state.boothDetails = action.payload.boothDetails;
      state.isDailyModeResult = action.payload.isDailyModeResult;
      state.authTokenModeResult = action.payload.authTokenModeResult;
      state.zonesettingResult = action.payload.zonesettingResult;
      localStorage.setItem('mode',JSON.stringify(action.payload.offlineMode))
      localStorage.setItem('boothDetails',JSON.stringify(action.payload.boothDetails))
      localStorage.setItem('isDailyModeResult',JSON.stringify(action.payload.isDailyModeResult))
      localStorage.setItem('authTokenModeResult',JSON.stringify(action.payload.authTokenModeResult))
      localStorage.setItem('zonesettingResult',JSON.stringify(action.payload.zonesettingResult))
    },
  },
});

export const { setOfflineMode,setAuthToken } = offlineReducer.actions;
export default offlineReducer.reducer;
