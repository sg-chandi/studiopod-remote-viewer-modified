import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  photoPageStep: 1,
  selectedPhoto: null,
  openPhotoPreview: false,
  isRetaking: false,
  modalOption:"retake",
  favorite:0
  // retake favorite endSession
};

export const photoInfoReducer = createSlice({
  name: "photoInfo",
  initialState,
  reducers: {
    setPhotoInfo: (state, { payload }) => {
      return {
        ...state,
        ...payload,
      };
    },
    setPhotoPage: (state, { payload }) => {
      state.photoPageStep = payload
    },
    setIsRetaking: (state, { payload }) => {
      state.isRetaking = payload
    },
    setSelectedPhoto: (state, { payload }) => {
      state.selectedPhoto = payload
    },

    resetState: (state) => initialState,
  },
});

export const {
  setPhotoInfo,
  setSelectedPhoto,
  setPhotoPage,
  resetState,
  setIsRetaking
} = photoInfoReducer.actions;
export default photoInfoReducer.reducer;
