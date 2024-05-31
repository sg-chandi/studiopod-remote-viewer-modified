import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./reducers/userInfoReducer";
import stepReducer from "state/reducers/steps";
import viewerStepsReducer from "state/reducers/viewerSteps";
import boothInfo from "./reducers/boothInfo";
import sessionInfo from "./reducers/sessionInfo";
import lightZoneSetting from "./reducers/lightZoneSetting";
import photosInfo from "./reducers/photosInfo";
import modalInfo from "./reducers/modalInfo";
import images from "./reducers/images";

export const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    steps: stepReducer,
    viewerStep: viewerStepsReducer,
    booth:boothInfo,
    sessionInfo:sessionInfo,
    lightZone:lightZoneSetting,
    photosInfo:photosInfo,
    modalInfo:modalInfo,
    img:images
  },
});
