import { useMemo } from "react";
import { PHOTO_SESSION_BASEURL } from "service/endpoints";

export const isBoothRole = (role = []) => {
  let roles = [];
  if (typeof role == "string") {
    roles.push(role);
  } else if (Array.isArray(role)) {
    roles = role;
  } else {
    return false;
  }
  return roles.includes("BOOTH");
};
export const usePhotoRender = (sequence, voucher) => {
  const url = useMemo(() => {
    let liveTime = new Date().getTime();
    const selectedPhoto =
      PHOTO_SESSION_BASEURL +
      voucher +
      "/" +
      sequence +
      "_thumb.jpg?" +
      liveTime;
    return selectedPhoto;
  }, [sequence, voucher]);
  return url;
};

export const clearLocalStorageData = () => {
  localStorage.removeItem("SessionId");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("clickSequence");
  localStorage.removeItem("userData");
  localStorage.removeItem("sessionInfo");
  localStorage.removeItem("boothLightZone");
  localStorage.removeItem("stepInfo");
  localStorage.removeItem("viewerStepInfo");
  localStorage.removeItem("photosInfo");
  localStorage.removeItem("modalInfo");
  localStorage.removeItem("BoothMode");
  localStorage.removeItem("userName");
  localStorage.removeItem("BoothName");
  
  
};
