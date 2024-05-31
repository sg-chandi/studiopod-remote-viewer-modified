import React from "react";
import { setIsRetaking, setPhotoPage } from "state/reducers/photosInfo";
import { setSessionInfo } from "state/reducers/sessionInfo";
import { useDispatch } from "react-redux";
import { setRemotePage } from "state/reducers/viewerSteps";
const RetakePhoto = ({ sendLog }) => {
  const Dispatch = useDispatch();

  const onRetake = () => {
    Dispatch(setIsRetaking(true));
    Dispatch(setSessionInfo({ sessionStartTime: Date.now() }));
    Dispatch(setRemotePage(8));
    sendLog({
      LogMsg: `Retaking picture.`,
      LogType: "success",
    });
  };
  return (
    <div className="retakePhoto_sec">
      <div className="upper_part fadeIn-animation-1s">
        <h2>
          Let’s take <br /> another shot
        </h2>
        <p>Tap a button below.</p>
      </div>
      <div className="down_part fadeIn-animation-1s" onClick={onRetake}>
        <h2>Tap to retake your photo</h2>
      </div>
    </div>
  );
};

export default RetakePhoto;
