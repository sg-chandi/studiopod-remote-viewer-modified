import { Curve, ModelExitSession, UniOn } from "assets/images";
import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import SessionDialogue from "../modals/inactivityModal";
import { unionSvg } from "assets/images/svg";
import { setStep } from "state/reducers/steps";

export default function ExitSessionPage() {
  const Dispatch = useDispatch();
  const [Open, setOpen] = useState(false);
  const [BackGround, setBackGround] = useState(false);
  const [union, setUnion] = useState(false);

  const handleSession = () => {
    setOpen(true);
  };

  const handleBackGroundImg = () => {
    setBackGround(true);
    setTimeout(() => {
      setUnion(true);
    }, 3000);
    setTimeout(() => {
      Dispatch(setStep(1));
    }, 6000);
  };

  return (
    <>
      {BackGround ? (
        <Fragment>
          <div className="skipBg_image">
            {union ? (
              <div className="loader_union">
                <img src={unionSvg} className="unionSvg" alt="union" />
              </div>
            ) : (
              <img src={UniOn} className="union" alt="union" />
            )}
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="exit_session_page">
            <div className="left_part">
              <div className="thank_you">
                <div className="content">
                  <h2>
                    Thank you for <br /> visiting Studio Pod
                  </h2>
                  <p>
                    Check your email for instructions on how to view <br /> and
                    download your photos.
                  </p>
                </div>
                <div className="unicorn_logo">
                  <img src={Curve} className="curve" alt="curve" />
                  <img src={UniOn} className="union" alt="union" />
                </div>
              </div>
              <div className="session_complete">
                <div className="content" onClick={handleSession}>
                  <h2>Session Completed</h2>
                </div>
              </div>
              <div className="footer">
                <p>
                  <span>Don’t forget to share and tag us</span>{" "}
                  <b>@thestudiopod</b>{" "}
                  <span>to be featured & for $10 off your next session.</span>
                </p>
              </div>
            </div>
            <div className="right_part">
              <div className="image_part">
                <img src={ModelExitSession} alt="model" />
              </div>
            </div>
          </div>
        </Fragment>
      )}

      <SessionDialogue
        open={Open}
        setOpen={setOpen}
        handleBackGroundImg={handleBackGroundImg}
      />
    </>
  );
}
