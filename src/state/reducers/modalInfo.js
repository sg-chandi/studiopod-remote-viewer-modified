import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exitSessionShow: false,
};

export const modalReducer = createSlice({
  name: "modalInfo",
  initialState,
  reducers: {
    setExitSessionModal: (state, { payload }) => {
      state.exitSessionShow = payload;
    },
  },
});

export const { setExitSessionModal, setInactivityModal } = modalReducer.actions;
export default modalReducer.reducer;
