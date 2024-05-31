import { clockSvg, curveSvg, unionSvg } from "assets/images/svg";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRemotePage } from "state/reducers/viewerSteps";
import { setSessionInfo } from "state/reducers/sessionInfo";
import Header from "components/header/header";

export default function Lookup({ sendLog }) {
  const Dispatch = useDispatch();
  const totalPhoto = useSelector(
    (state) => state.sessionInfo.initiatedSession.clickAllowed
  );
  const { userName } = useSelector((state) => state.userInfo);
  const handleStartSession = () => {
    Dispatch(setRemotePage(8));
    // onPageChange(8)
    sendLog({
      LogMsg: `Count down start.`,
      LogType: "success",
    });
    Dispatch(setSessionInfo({ sessionStartTime: Date.now() }));
  };
  return (
    <>
      <Header
        leftText={
          <p>
            <em> {userName.split(" ")[0]}<span className="opacity_fade">'s Studio Pod Session.</span></em>
          </p>
        }
        midText=""
        hideActionBtn={false}
        // disableActionBtn={true}
      />
      <div className="lookup_sec fadeIn-animation-1s">
        <div className="upper_part">
          <div className="left_part">
            <div className="body">
              <div className="images">
                <img src={clockSvg} alt="clock" />
              </div>
              <div className="content">
                <h3>Start timer</h3>
                <p>It's time to start your photo shoot</p>
              </div>
            </div>
          </div>
          <div className="right_part">
            <div className="content">
              <div className="tag">Photos Left</div>
              <h2 className="photo_count">
                {totalPhoto}/{totalPhoto}
              </h2>
            </div>
            <img src={unionSvg} alt="unionSvg" className="union" />
            <img src={curveSvg} alt="curve" className="curve" />
          </div>
        </div>
        <div className="lower_part" onClick={handleStartSession}>
          <h2>Tap to start your session</h2>
        </div>
      </div>
    </>
  );
}
