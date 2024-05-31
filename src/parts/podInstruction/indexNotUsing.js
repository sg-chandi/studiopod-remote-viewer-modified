import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Union from "../../assets/images/Union.png";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import PodInstruction from "./PodInstruction";
import {
  setExitStep,
  setPoseStep,
  setSessionCompletedStep,
  setExitSessionStep,
} from "state/reducers/steps";
import Pose from "../pose";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#000",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
export default function PodInstructionComponent() {
  const Dispatch = useDispatch();
  const { userName } = useSelector((state) => state.userInfo);
  const exitStep = useSelector((state) => state.steps.exitStep);
  const [showGuidePage, setShowGuidePage] = useState(true);
  const poseStep = useSelector((state) => state.steps.poseStep);
  const gridStep = useSelector((state) => state.steps.gridStep);
  const sessionCompleted = useSelector((state) => state.steps.sessionCompleted);
  const photoPreviewStep = useSelector((state) => state.steps.photoPreviewStep);
  const [exitSession, setExitSession] = useState(false);
  const [isContinueToPosingGuide, setIsContinueToPosingGuide] = useState(false);
  const handleExistSession = () => {
    setExitSession(true);
    Dispatch(setExitSessionStep(true));
  };
  const completedSessionFunction = () => {
    setExitSession(true);
    Dispatch(setSessionCompletedStep(true));
  };
  const cancelExitSession = () => {
    setExitSession(false);
    Dispatch(setSessionCompletedStep(false));
    Dispatch(setExitSessionStep(false));
  };
  const continueToPosingGuide = (data) => {
    if (data) setIsContinueToPosingGuide(true);
    else setIsContinueToPosingGuide(false);
  };
  const gotoPoseScreen = () => {
    Dispatch(setExitStep(2));
    Dispatch(setPoseStep(1));
  };
  const posingScreenSetup = () => {
    if (poseStep < 5) Dispatch(setPoseStep(poseStep + 1));
    else Dispatch(setExitStep(3));
  };
  return (
    <div className="PodInstruction">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={12}
        className="PodInstructionHead"
      >
        <div className="lftTxt">
          {exitStep < 3 && (
            <p>
              <span>Hi ,</span>
              <em> {userName.split(" ")[0]}</em>
            </p>
          )}
          {exitStep > 2 && (
            <p>
              <em> {userName}</em>
              <span> Studio Pod Session.</span>
            </p>
          )}
        </div>
        {
          <>
            <div className="middleTxt">
              {exitStep < 3 && (
                <h1>
                  {exitStep === 1 ? "How to use The Pod" : "Posing Guide"}
                </h1>
              )}
            </div>
            {exitStep < 5 && (
              <Button
                variant="contained"
                className="exit_btn"
                onClick={handleExistSession}
                disabled={exitStep === 4}
              >
                Exit Session
              </Button>
            )}
          </>
        }
      </Stack>
      { showGuidePage ? (
        <PodInstruction continueToPosingGuide={continueToPosingGuide} />
      ) : (
        <div className="pose_body">
          <Pose />
        </div>
      )}

      {(exitStep < 3 || exitStep > 5) && (
        <Grid container className="footerSec">
          <Grid
            item
            xs={exitSession || sessionCompleted ? 12 : 6}
            md={exitSession || sessionCompleted ? 12 : 9}
          >
            <Item>
              <div className="footLft">
                <p>STUDIO POD © 2023</p>
                <img src={Union} alt="union_image" className="footer_img" />
              </div>
            </Item>
          </Grid>
          {!sessionCompleted && !exitSession && (
            <Grid item xs={6} md={3}>
              <Item>
                <div className="srchBtn">
                  <Button
                    variant={
                      isContinueToPosingGuide || photoPreviewStep < 2
                        ? "contained"
                        : "outlined"
                    }
                    className={
                      isContinueToPosingGuide && photoPreviewStep < 2
                        ? poseStep === 5 || (gridStep === 4 && poseStep === 0)
                          ? "filledBtn colorBtn text-capitalize"
                          : "filledBtn colorPoseBtn text-capitalize"
                        : "filledBtn text-capitalize"
                    }
                    fullWidth
                    endIcon={<ArrowCircleRightOutlinedIcon />}
                    disabled={!isContinueToPosingGuide || photoPreviewStep > 2}
                    onClick={() =>
                      exitStep === 1
                        ? gotoPoseScreen()
                        : exitStep === 6
                        ? completedSessionFunction()
                        : posingScreenSetup()
                    }
                  >
                    {exitStep === 1
                      ? "Continue"
                      : poseStep === 5
                      ? exitStep === 6
                        ? "Complete Session"
                        : "Start your session"
                      : "Next Pose"}
                  </Button>
                </div>
              </Item>
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
}
