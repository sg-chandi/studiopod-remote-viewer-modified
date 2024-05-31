import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gridStep: 0,
  poseStep: 1,
};

export const stepReducer = createSlice({
  name: "steps",
  initialState,
  reducers: {
    setGridStep: (state, { payload }) => {
      state.gridStep = payload;
    },
    setPoseStep: (state, { payload }) => {
      state.poseStep = payload;
    },
    setSteps: (state, { payload }) => {
      return {
        ...state,
        ...payload,
      };
    },

    resetSate: (state) => initialState,
  },
});

export const { setGridStep, setPoseStep, resetSate,setSteps } = stepReducer.actions;
export default stepReducer.reducer;
