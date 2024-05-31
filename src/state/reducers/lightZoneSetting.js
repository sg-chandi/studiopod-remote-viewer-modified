import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedZoneType: null, //{key:"",value:null},
  allOptions: [],
  clientZoneAvailable: false,
  clientZone: "",
  isBoothZoneActive: true,
  zoneFetched: false,
  zonePreviewStep: null,
};

export const zoneReducers = createSlice({
  name: "lightZone",
  initialState,
  reducers: {
    setClientZone: (state, { payload }) => {
      state.clientZoneAvailable = payload.clientZoneAvailable;
      state.clientZone = payload.clientZone;
      state.selectedZoneType = state.clientZone
    },
    setZoneType: (state, { payload }) => {
      state.selectedZoneType = payload;
    },
    setZonePreviewStep: (state, { payload }) => {
      state.zonePreviewStep = payload;
    },
    setZoneFetched: (state, { payload }) => {
      state.zoneFetched = payload;
    },
    setLightZone: (state, { payload }) => {
      state.allOptions = [state.clientZone,...payload.zone];
      state.selectedZoneType =
        state.selectedZoneType == null
          ? payload.zone[payload.isActive == null ? 0 : payload.isActive]
          : state.selectedZoneType;

      state.zonePreviewStep =
        state.selectedZoneType == null
          ? payload.zone[payload.isActive == null ? 0 : payload.isActive]
          : state.selectedZoneType;
    },
    setZoneInfo: (state, { payload }) => {
      return {
        ...state,
        ...payload,
      };
    },
    resetZoneSetting: (state) => initialState,
  },
});

export const {
  setClientZone,
  resetZoneSetting,
  setZoneFetched,
  setLightZone,
  setZoneType,
  setZonePreviewStep,
  setZoneInfo,
} = zoneReducers.actions;
export default zoneReducers.reducer;
