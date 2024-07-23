import { createSlice } from "@reduxjs/toolkit";
const mode = localStorage.getItem('mode')
const initialState = {
  offlineMode: localStorage.getItem('mode') ?JSON.parse(localStorage.getItem('mode')): "online",
  authToken:localStorage.getItem('authToken') ?JSON.parse(localStorage.getItem('authToken')):null,
  boothDetails: localStorage.getItem('boothDetails') ?JSON.parse(localStorage.getItem('boothDetails')):{},
  isDailyModeResult: localStorage.getItem('isDailyModeResult') ?JSON.parse(localStorage.getItem('isDailyModeResult')):{},
  zonesettingResult: localStorage.getItem('zonesettingResult') ?JSON.parse(localStorage.getItem('zonesettingResult')):{},
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
      localStorage.setItem('mode',JSON.stringify(action.payload.offlineMode))
    },
    setOfflineModeData(state,action){
      state.boothDetails = action.payload.boothDetails;
      state.isDailyModeResult = action.payload.isDailyModeResult;
      state.authTokenModeResult = action.payload.authTokenModeResult;
      state.zonesettingResult = action.payload.zonesettingResult;
      localStorage.setItem('boothDetails',JSON.stringify(action.payload.boothDetails))
      localStorage.setItem('isDailyModeResult',JSON.stringify(action.payload.isDailyModeResult))
      localStorage.setItem('authTokenModeResult',JSON.stringify(action.payload.authTokenModeResult))
      localStorage.setItem('zonesettingResult',JSON.stringify(action.payload.zonesettingResult))
    }
  },
});

export const { setOfflineMode,setAuthToken,setOfflineModeData } = offlineReducer.actions;
export default offlineReducer.reducer;
