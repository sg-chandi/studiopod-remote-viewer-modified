import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  all: [
    {
      name: "",
      url: "",
    },
  ],
};

export const imgReducer = createSlice({
  name: "modalInfo",
  initialState,
  reducers: {
    setImages: (state, { payload }) => {
      state.img = payload;
    },
  },
});

export const { setImages } = imgReducer.actions;
export default imgReducer.reducer;
