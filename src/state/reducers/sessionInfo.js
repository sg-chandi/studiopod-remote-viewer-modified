import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle", //on going, ending, ended
  lastActivity: 0, //time
  selectedCorporateClientID: null,
  selectedBoothID: null,
  inviteInfo: {
    activationKey: "",
    appointmentId: null,
    coupon: null,
    inviteId: null,
    inviteName: "",
    sessionId: null,
    user: null,
    userEmail: null,
    corporateClientId: null,
  },
  initiatedSession: {
    id: null,
    name: null,
    coupon: null,
    inviteSent: null,
    inviteAccepted: null,
    sessionCompleted: null,
    status: null,
    boothId: null,
    userId: null,
    corporateOrderId: null,
    retakeAllowed: null,
    clickAllowed: null,
    isUnlimited: null,
    isUnlimitedStudio: null,
    isUnlimitedRetouching: null,
    touchupServicePrice: null,
  },
  presetAvailable: {},
  presetActionID: null,
  photoClicked: 0,
  photoRetake: 0,

  currentImageSequence: 0,
  sessionStartTime: null,
  sessionStatus: null,
  sessionFetched: false,
  orderFetched: false,
  hasError: false,
  isValid: true,
  sessionSubmitting: false
};

export const sessionInfo = createSlice({
  name: "sessionInfo",
  initialState,
  reducers: {
    setSessionInfo: (state, { payload }) => {
      return {
        ...state,
        ...payload,
      };
    },
    setIncreaseRetake: (state, { payload }) => {
      state.photoRetake = state.photoRetake + 1;
    },
    setSessionInviteInfo: (state, { payload }) => {
      state.inviteInfo = payload;
    },
    setSessionInitiated: (state, { payload }) => {
      state.initiatedSession = payload;
    },
    resetSessionInfo: (state) => initialState,
  },
});

export const {
  setIncreaseRetake,
  setSessionInfo,
  setUserEmailAction,
  resetSessionInfo,
  setSessionInviteInfo,
  setSessionInitiated
} = sessionInfo.actions;
export default sessionInfo.reducer;
