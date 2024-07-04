import Header from "components/header/header";
import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import Button from "@mui/material/Button";
import curve from "../../assets/images/curve-2.png";
import arrowDown from "../../assets/images/down-arrow.png";
import { gridIcon1 } from "assets/images/svg";
import { PiArrowCircleRightThin } from "react-icons/pi";
import { useSelector, useDispatch } from "react-redux";
import { setRemotePage } from "state/reducers/viewerSteps";
import Footer from "components/footer/footer";
import { lightIcon } from "assets/images";
import {
  setZoneType,
  setZonePreviewStep,
} from "state/reducers/lightZoneSetting";

const LightZone = ({ onPageChange, changeLightZone,handleOffLight }) => {
  const { userName } = useSelector((state) => state.userInfo);
  const[selectZone,setSelectedZone] = useState(false)
  const lightZone = useSelector((state) => state.lightZone);
  const selectedPreviewZone = lightZone.zonePreviewStep;
  const lightStep = lightZone.allOptions.findIndex(
    (obj) => obj.key === selectedPreviewZone?.key
  );
  const Dispatch = useDispatch();
  console.log('lightzone ',lightZone)

  const getAndSetLightStep = (zone, isSubmit) => {
    if (lightZone.allOptions.length <= lightStep + 1 && isSubmit) {
      handleOffLight()
      Dispatch(setRemotePage(61));
      onPageChange(61);
    } else {
      Dispatch(setZonePreviewStep(zone));
      //next page
    }
  };
  const handleContinue = () => {
    handleOffLight()
    Dispatch(setRemotePage(61));
    onPageChange(61);
  };
  const settingZone = (zone) => {
    changeLightZone(zone);
    Dispatch(setZoneType(zone));
    setSelectedZone(true)
  };
  const handleBack = () => {
    Dispatch(setRemotePage(6));
    onPageChange(6);
  };
  return (
    <div className="lightZone_sec">
      <Header
        leftText={
          <p>
            <span className="opacity_fade">Hi ,</span>
            <em> {userName.split(" ")[0]}</em>
          </p>
        }
        midText="Select the light zone for your shoot"
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
        {lightZone.allOptions?.length > 0 ? (
          lightZone.allOptions.map((zone, index) => {
            console.log(index)
            let name = zone?.key;
            let notfound = false;
            switch (zone?.key) {
              case "Default":
                name = "Default Light";
                break;
              case "Shadow1":
                name = "Shadow 1";
                break;
              case "Shadow2":
                name = "Shadow 2";
                break;
              case "Full":
                name = "Full Shadow";
                break;
              case "Mid Shadow":
                name = "Mid Shadow";
                break;
              default:
                name = "Not found";
                notfound = true;
                break;
            }
            const nameSplitted = name.split(" ");
            return notfound ? null : (
              <div
                className={
                  selectedPreviewZone.key === zone?.key
                    ? `UseBx active grid-${
                        index + 1 > 5 ? (index + 1) % 5 : index + 1
                      }`
                    : "UseBx"
                }
                onClick={() => getAndSetLightStep(zone)}
                key={index}
              >
                {selectedPreviewZone.key === zone?.key ? (
                  <>
                    <div className="curveDiv">
                      <img
                        src={curve}
                        className="curveIcon"
                        alt="Adjust Stool"
                      />
                      <img
                        src={arrowDown}
                        className="arrowIcon"
                        alt="Adjust Stool"
                      />
                    </div>
                    <img
                      src={gridIcon1}
                      className="boxIcon"
                      alt="Adjust Stool"
                    />
                    <div className="blurBox">
                      <div className="content">
                        <h2>{name}</h2>
                        <h6>
                          The advantages of using this light zone for your shoot
                          are this and that.
                        </h6>
                        <Button
                          variant="contained"
                          endIcon={<PiArrowCircleRightThin />}
                          onClick={() => settingZone(zone)}
                        >
                          Select This Light
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="Bxicon">
                      <ArrowOutwardIcon />
                    </div>
                    <div className="BxContent">
                      <img src={lightIcon} alt="Adjust Stool" />
                      <p>
                        {nameSplitted[0]}
                        <br /> {nameSplitted[1]}
                      </p>
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <h1>No data found</h1>
        )}
      </Stack>
      <Footer
        hideActionButton={false}
        actionBtnText={"continue"}
        disableActionBtn={false}
        onClickActionBtn={
          handleContinue
        //  ()=> getAndSetLightStep(lightZone.allOptions[lightStep + 1], true)
        }
        btnVariant={
          lightStep + 1 === lightZone.allOptions.length || selectZone
            ? "contained"
            : "outlined"
        }
        btnClassName={
          lightStep + 1 === lightZone.allOptions.length || selectZone
            ? "filledBtn colorBtn text-capitalize"
            : "filledBtn text-capitalize"
        }

        onSkip={handleContinue}
        skipButtonName="Skip Light Zone"
        showSkip
      />
    </div>
  );
};

export default LightZone;
