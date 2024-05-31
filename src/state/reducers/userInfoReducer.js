import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  userEmail: "",
  isLoggedIn: false,
  voucherCode: "",
  phone: "",
};

export const userInfoReducer = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserNameAction: (state, action) => {
      state.userName = action.payload;
    },
    setUserEmailAction: (state, action) => {
      state.userEmail = action.payload;
    },
    setUserLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setVoucherCode: (state, action) => {
      state.voucherCode = action.payload;
    },
    setUserPhone: (state, action) => {
      state.phone = action.payload;
    },
    setUser: (state, {payload}) => {
      return {
        ...state,
        ...payload,
      };
    },
    resetSateForUser: (state) => initialState,
  },
});

export const {
  setUserNameAction,
  setUserEmailAction,
  resetSateForUser,
  setUserLoggedIn,
  setVoucherCode,
  setUserPhone,
  setUser
} = userInfoReducer.actions;
export default userInfoReducer.reducer;
