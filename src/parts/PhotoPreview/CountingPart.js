import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { arrowRight } from "assets/images/svg";
import { setRemotePage } from "state/reducers/viewerSteps";

export default function CountingPart() {
  const sessionInfo = useSelector(state => state.sessionInfo)
  const Dispatch = useDispatch();
  const handleNextPhoto = () => {
    if (sessionInfo.initiatedSession.clickAllowed <= sessionInfo.photoClicked) return
    Dispatch(setRemotePage(8))

  }

  return (
    <>
      <div className="upper_part">
        <div className="session">
          <h2>
            Studio Pod <br /> Full Session
          </h2>
          <p>Tap a photo to view</p>
        </div>
        <div className="photos_left">
          <div className="tag">Photos Left</div>
          <h2>
            {sessionInfo.initiatedSession.clickAllowed - sessionInfo.photoClicked}/{sessionInfo.initiatedSession.clickAllowed}
          </h2>
        </div>
      </div>
      <div className="down_part" onClick={handleNextPhoto}>
        <span>Take Next Photo</span>
        <img src={arrowRight} alt="arrow" style={{width:"2vw"}}/>
      </div>
    </>
  );
}
