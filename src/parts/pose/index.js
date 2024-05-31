import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { useSelector, useDispatch } from "react-redux";
import { setPoseStep } from "state/reducers/steps";
import Header from "components/header/header";
import Footer from "components/footer/footer";
import { setRemotePage } from "state/reducers/viewerSteps";
import {
  pose1,
  pose10,
  pose11,
  pose12,
  pose13,
  pose14,
  pose15,
  pose2,
  pose3,
  pose4,
  pose5,
  pose6,
  pose7,
  pose8,
  pose9,
} from "assets/images";

export default function Pose({ onPageChange }) {
  const poseStep = useSelector((state) => state.steps.poseStep);
  const { userName } = useSelector((state) => state.userInfo);
  const hasCorporateLightSetting = useSelector(state=>state.lightZone.clientZoneAvailable)
  const Dispatch = useDispatch();
  const [poseData, setPoseData] = useState([]);
  const [poseContent, setPoseContent] = useState({});

  const handleNextPage = () => {
    if (poseStep < 5) {
      Dispatch(setPoseStep(poseStep + 1));
    } else {
      //next page
      //CHANGE PAGE
      Dispatch(setRemotePage(7));
      onPageChange(7);
    }
  };
  useEffect(() => {
    if (poseStep === 1) {
      setPoseData([pose1, pose2, pose3]);
      setPoseContent({
        leftPart: "Turn your body to <br /> the right or left",
        rightPart:
          "Your chair swivels, so take advantage and rotate! Take a couple photos, varying how much you turn from center each click. Now go the other way.",
      });
    }
    if (poseStep === 2) {
      setPoseData([pose4, pose5, pose6]);
      setPoseContent({
        leftPart: "Cross <br /> your arms",
        rightPart:
          "Be the boss. But check your clothes after crossing your arms to make sure everything looks its best.",
      });
    }
    if (poseStep === 3) {
      setPoseData([pose7, pose8, pose9]);
      setPoseContent({
        leftPart: "Pearly <br /> whites",
        rightPart:
          "Give an authentic smile and create an image that stands out.",
      });
    }
    if (poseStep === 4) {
      setPoseData([pose10, pose11, pose12]);
      setPoseContent({
        leftPart: "Calm <br/> presence",
        rightPart: "Smile softly, but don't show your teeth.",
      });
    }
    if (poseStep === 5) {
      setPoseData([pose13, pose14, pose15]);
      setPoseContent({
        leftPart: "Get silly <br/> with it",
        rightPart:
          "Try an image showing off your personality. Create an image that is fun!",
      });
    }
  }, [poseStep]);
  const handleBack = () => {
    Dispatch(setRemotePage(hasCorporateLightSetting?6:4));
    onPageChange(4);
    Dispatch(setPoseStep(1));
  };
  return (
    <div className="PodInstruction">
      <Header
        leftText={
          <p>
            <span className="opacity_fade">Hi ,</span>
            <em> {userName.split(" ")[0]}</em>
          </p>
        }
        midText="Posing Guide"
        hideActionBtn={false}
        showBackButton
        onBack={handleBack}
      />
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        className="UseBxSec"
      >
        <div className="UseBxPose">
          <div className="img_part">
            {poseData &&
              poseData.length > 0 &&
              poseData.map((item, i) => {
                return (
                  <img
                    id={i}
                    key={i}
                    src={item}
                    alt="pose"
                    className="pose_img"
                  />
                );
              })}
          </div>
          <div className="pose_cont">
            <div
              className="left_part"
              dangerouslySetInnerHTML={{ __html: poseContent.leftPart }}
            />
            <div className="right_part">
              {poseContent && poseContent.rightPart}
            </div>
          </div>
        </div>
      </Stack>
      <Footer
        hideActionButton={false}
        actionBtnText={poseStep === 5 ? "Start your session" : "Next Pose"}
        disableActionBtn={false}
        onClickActionBtn={handleNextPage}
        btnVariant={poseStep === 5 ? "contained" : "outlined"}
        btnClassName={
          poseStep === 5
            ? " filledBtn colorBtn text-capitalize"
            : "filledBtn colorPoseBtn text-capitalize"
        }
        onSkip={() => {
          Dispatch(setRemotePage(7));
          onPageChange(7);
        }}
        skipButtonName="Skip Posing Guide"
        showSkip
      />
    </div>
  );
}
