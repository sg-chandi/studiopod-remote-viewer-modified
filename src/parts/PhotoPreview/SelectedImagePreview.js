import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Curve } from "assets/images";
import { arrowLeft } from "assets/images/svg";
import { IoMdRefresh } from "react-icons/io";
import { usePhotoRender } from "helper/func";
import {
  setPhotoInfo,
  setIsRetaking,
  setPhotoPage,
} from "state/reducers/photosInfo";

export default function SelectedImagePreview() {
  const Dispatch = useDispatch();

  const sessionInfo = useSelector((state) => state.sessionInfo);
  const photoInfo = useSelector((state) => state.photosInfo);
  const photoPageStep = photoInfo.photoPageStep;
  const imgUrl = usePhotoRender(
    photoInfo.selectedPhoto,
    sessionInfo.initiatedSession.coupon
  );
  const onBack = () => {
    Dispatch(
      setPhotoInfo({
        photoPageStep: 1,
        selectedPhoto: null,
        openPhotoPreview: false,
        isRetaking: false,
      })
    );
  };
  const isRetakeAvailable =
    sessionInfo.initiatedSession.retakeAllowed > sessionInfo.photoRetake;
  const formatIndex = (number) => {
    return number.toString().padStart(2, "0");
  };
  const onRetake = () => {
    Dispatch(
      setPhotoInfo({
        photoPageStep: 2,
        modalOption: "retake",
      })
    );
  };

  return (
    <>
      {photoInfo.photoPageStep === 4 ? (
        <div
          className={`selectedImage_preview_sec ${
            photoInfo.modalOption == "favoriteNew" && "imgPart"
          }`}
        >
          <img src={imgUrl} alt="selected_image" className="selectedimage" />
        </div>
      ) : (
        <div className="selectedImage_preview_sec">
          <img src={imgUrl} alt="selected_image" className="selectedimage" />
          <div className="radius">{formatIndex(photoInfo.selectedPhoto)}</div>
          <span className="cursor-pointer" onClick={onBack}>
            <img src={Curve} alt="curve" className="curve" />
            <img src={arrowLeft} alt="arrowLeft" className="arrow" />
          </span>
          {isRetakeAvailable && (
            <div className="retake" fadeInLeft onClick={onRetake}>
              <span>Retake</span>
              <IoMdRefresh />
            </div>
          )}
        </div>
      )}
    </>
  );
}
