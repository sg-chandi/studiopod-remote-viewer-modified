import React, { useEffect } from "react";
import Stack from "@mui/material/Stack";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useSelector, useDispatch } from "react-redux";
import curve from "../../assets/images/curve-2.png";
import arrowDown from "../../assets/images/down-arrow.png";
import { gridIcon1, gridIcon2, gridIcon3, gridIcon4 } from "assets/images/svg";
import { setGridStep } from "state/reducers/steps";
import Header from "components/header/header";
import Footer from "components/footer/footer";
import { setRemotePage } from "state/reducers/viewerSteps";
import { bx1, bx2, bx3, bx4 } from "assets/images";

export default function PodInstruction({ onPageChange }) {
  const { userName } = useSelector((state) => state.userInfo);
  const hasCorporateLightSetting = useSelector(
    (state) => state.lightZone.clientZoneAvailable
  );
  const Dispatch = useDispatch();
  const gridStep = useSelector((state) => state.steps.gridStep);
  const getAndSetGridStep = (step) => {
    if (step < 5) {
      Dispatch(setGridStep(step));
    } else {
      //next page
      //CHANGE PAGE
      Dispatch(setRemotePage(hasCorporateLightSetting ? 61 : 4));
      onPageChange(6);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      Dispatch(setGridStep(1));
    }, 500);
  }, [Dispatch]);
  return (
    <div className="PodInstruction">
      <Header
        leftText={
          <p>
            <span className="opacity_fade">Hi ,</span>
            <em> {userName.split(" ")[0]}</em>
          </p>
        }
        midText="How to use The Pod"
        hideActionBtn={false}
      />
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        className="UseBxSec"
      >
        <div
          className={gridStep === 1 ? "UseBx active grid-1" : "UseBx"}
          onClick={() => getAndSetGridStep(1)}
        >
          {gridStep === 1 ? (
            <>
              <div className="curveDiv">
                <img src={curve} className="curveIcon" alt="Adjust Stool" />
                <img src={arrowDown} className="arrowIcon" alt="Adjust Stool" />
              </div>
              <img src={gridIcon1} className="boxIcon" alt="Adjust Stool" />
              <div className="blurBox">
                <div className="content">
                  <h2>Adjust Stool</h2>
                  <h6>
                    Ensure you're within the frame, aligning with the green Safe
                    Zone lines, by pulling the stool lever to rise up or down.
                  </h6>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="Bxicon">
                <ArrowOutwardIcon />
              </div>
              <div className="BxContent">
                <img src={bx1} alt="Adjust Stool" />
                <p>
                  Adjust <br />
                  Stool
                </p>
              </div>
            </>
          )}
        </div>
        <div
          className={gridStep === 2 ? "UseBx active grid-2" : "UseBx"}
          onClick={() => getAndSetGridStep(2)}
        >
          {gridStep === 2 ? (
            <>
              <div className="curveDiv">
                <img src={curve} className="curveIcon" alt="Adjust Stool" />
                <img src={arrowDown} className="arrowIcon" alt="Adjust Stool" />
              </div>
              <img src={gridIcon2} className="boxIcon" alt="Adjust Stool" />
              <div className="blurBox">
                <div className="content">
                  <h2>Sit. Smile. Snap.</h2>
                  <h6>
                    Each time you want to take a photo, just tap the screen to
                    start the 5- second timer. Look up at the camera before it
                    hits zero. Press Continue to get started.
                  </h6>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="Bxicon">
                <ArrowOutwardIcon />
              </div>
              <div className="BxContent">
                <img src={bx2} alt="Sit, Smile, Snap" />
                <p>
                  Sit. Smile.
                  <br /> Snap.
                </p>
              </div>
            </>
          )}
        </div>
        <div
          className={gridStep === 3 ? "UseBx active grid-3" : "UseBx"}
          onClick={() => getAndSetGridStep(3)}
        >
          {gridStep === 3 ? (
            <>
              <div className="curveDiv">
                <img src={curve} className="curveIcon" alt="Adjust Stool" />
                <img src={arrowDown} className="arrowIcon" alt="arrow" />
              </div>
              <img src={gridIcon3} className="boxIcon" alt="Adjust Stool" />
              <div className="blurBox">
                <div className="content">
                  <h2>Review your Session</h2>
                  <h6>
                    Once your session is done, click "Review Session." Not happy
                    with an image? Just choose "Retake" for another shot.
                  </h6>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="Bxicon">
                <ArrowOutwardIcon />
              </div>
              <div className="BxContent">
                <img src={bx3} alt="Review  Session" />
                <p>
                  Review <br /> Session
                </p>
              </div>
            </>
          )}
        </div>
        <div
          className={gridStep === 4 ? "UseBx active grid-4" : "UseBx"}
          onClick={() => getAndSetGridStep(4)}
        >
          {gridStep === 4 ? (
            <>
              <div className="curveDiv">
                <img src={curve} className="curveIcon" alt="Adjust Stool" />
                <img src={arrowDown} className="arrowIcon" alt="arrow" />
              </div>
              <img src={gridIcon4} className="boxIcon" alt="Adjust Stool" />
              <div className="blurBox">
                <div className="content">
                  <h2>Share Your Favorite</h2>
                  <h6>
                    Click "Looks Great," enter your number, and you're done.
                    Share your favorite, tag #MadeByStudio Pod, and get $10 off
                    your next session.
                  </h6>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="Bxicon">
                <ArrowOutwardIcon />
              </div>
              <div className="BxContent">
                <img src={bx4} alt="Share Your Favorites" />
                <p>
                  Share Your <br />
                  Favorites
                </p>
              </div>
            </>
          )}
        </div>
      </Stack>
      <Footer
        hideActionButton={false}
        actionBtnText={"continue"}
        disableActionBtn={false}
        onClickActionBtn={() => getAndSetGridStep(gridStep + 1)}
        btnVariant={"contained"}
        // btnVariant={gridStep === 4 ? "contained" : "outlined"}
        btnClassName={"filledBtn colorBtn text-capitalize"}
        // btnClassName={
        //   gridStep === 4
        //     ? "filledBtn colorBtn text-capitalize"
        //     : "filledBtn text-capitalize"
        // }
      />
    </div>
  );
}
