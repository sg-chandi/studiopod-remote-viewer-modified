import { createSlice } from "@reduxjs/toolkit";

const initialState = {

  remotePage: 1,
  viewerPage: 1,
  activePosition: 1,
};

export const viewerStepsReducer = createSlice({
  name: "viewerSteps",
  initialState,
  reducers: {
    setRemotePage: (state, { payload }) => {
      state.remotePage = payload;
    },
    setViewerPage: (state, { payload }) => {
      state.viewerPage = payload;
    },
    setActivePosition: (state, { payload }) => {
      state.activePosition = payload;
    },
    setViewerSteps: (state, { payload }) => {
      return {
        ...state,
        ...payload,
      };
    },
    resetSateForViewerSteps: (state) => initialState,
  },
});

export const {
  resetSateForViewerSteps,
  setRemotePage,
  setViewerPage,
  setActivePosition,
  setViewerSteps
} = viewerStepsReducer.actions;
export default viewerStepsReducer.reducer;
