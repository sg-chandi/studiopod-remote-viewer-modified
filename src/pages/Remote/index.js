import React, { useCallback, useEffect, useState, useRef } from "react";
import LandingPage from "parts/LandingPage";
import UserLogin from "parts/UserLogin";
import PodInstruction from "parts/podInstruction/PodInstruction";
import LightZone from "parts/LightZone";
import Pose from "parts/pose";
import ExitSessionPage from "parts/ExitSessionPage";
import { useSelector, useDispatch } from "react-redux";
import { unstable_usePrompt as usePrompt } from "react-router-dom";
import SessionContext from "components/sessionFunctions/sessionContext";
import Lookup from "parts/Lookup";
import BoothLogin from "parts/BoothLogin";
import CountDownPage from "parts/Lookup/CountDownPage";
import ImagePreview from "parts/Lookup/ImagePreview";
import PhotoPreview from "parts/PhotoPreview";
import * as signalR from "@microsoft/signalr";
import { SIGNAL_R_CONNECTION } from "service/endpoints";
import { setBoothError, setBoothActivity } from "state/reducers/boothInfo";
import { setRemotePage } from "state/reducers/viewerSteps";
import { setPhotoInfo } from "state/reducers/photosInfo";
import { setSessionInfo, setIncreaseRetake } from "state/reducers/sessionInfo";
import { updateSession, validateSession } from "service/remoteAPI";
import CloseSession from "parts/modals/CloseSession";
import InactivityModal from "parts/modals/inactivityModal";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import NoOrderFound from "parts/NoOrderFound";
import { useNavigate } from "react-router-dom";

export default function Remote() {
  const remotePage = useSelector((state) => state.viewerStep.remotePage);
  const selectedZone = useSelector((state) => state.lightZone.selectedZoneType);
  const sessionInfo = useSelector((state) => state.sessionInfo);
  const boothInfo = useSelector((state) => state.booth);
  const userInfo = useSelector((state) => state.userInfo);
  const photoInfo = useSelector((state) => state.photosInfo);
  const photoInfoRef = useRef();
  const hubCommendRef = useRef({
    ActionToPerform: "viewer",
    VoucherCode: "",
    ImageSequence: 0,
    Remote: 1,
    Viewer: 1,
    ActivePosition: 0,
    // PhotoPresetId:null
  });
  const navigate = useNavigate();

  const Dispatch = useDispatch();
  const [recentClickSequence, setRecentClickSequence] = useState(null);
  const [hubConnection, setHubConnection] = useState(null);
  const [hubConnected, setHubConnected] = useState(false);

  useEffect(() => {
    let connectSignalR = () => {
      const hub_Connection = new signalR.HubConnectionBuilder()
        .withUrl(SIGNAL_R_CONNECTION)
        .build();
      setHubConnection(hub_Connection);
    };
    connectSignalR();
    // return () => {
    //   // connectSignalR = null;
    // };
  }, []);
  useEffect(() => {
    photoInfoRef.current = photoInfo;
  }, [photoInfo]);

  useEffect(() => {
    if (hubConnection == null || hubConnected) return;
    console.log(
      "connect ******************************************************************"
    );
    hubConnection.start().then(() => {
      console.log("Hub connected");
      setHubConnected(true);
      hubConnection
        .invoke("SendCommandToWinClient", {
          ...hubCommendRef.current,
          ActionToPerform: "Stage0",
        })
        .catch((err) => console.error("ERROR" + err));
      console.log("stage0", {
        ...hubCommendRef.current,
        ActionToPerform: "Stage0",
      });

      hubConnection
        .invoke("SendCommandToWebClient", hubCommendRef.current)
        .catch((err) => console.error("ERROR" + err));
      console.log("web", {
        ...hubCommendRef.current,
      });
      hubConnection
        .invoke("SendCommandToWinClient", {
          ...hubCommendRef.current,
          ActionToPerform: "Stage1",
        })
        .catch((err) => console.error("ERROR" + err));
      console.log("win ", {
        ...hubCommendRef.current,
        ActionToPerform: "Stage1",
      });
    });
    hubConnection.on("send", (data) => {
      console.log("hubData", data);
    });
    hubConnection.on("onWebCommandReceived", (result) => {
      // console.log(result.actionToPerform);
      if (result.actionToPerform === "onError") {
        console.log("Command Error", result);
        Dispatch(
          setBoothError({
            hasError: true,
            errorName: "camera",
            error: null,
          })
        );
        Dispatch(setBoothActivity({ isCameraConnected: false }));
        const comm = {
          ActionToPerform: "LogSave",
          PodActivityLog: {
            BoothId: localStorage.getItem("BoothId"),
            SessionId: null,
            LogType: "error",
            LogMsg: `Failed to start hub connection. BoothId: ${localStorage.getItem(
              "BoothId"
            )}.}`,
          },
        };
        hubConnection
          .invoke("SendCommandToWinClient", comm)
          .catch((err) => console.error("ERROR" + err));
      }

      if (result.actionToPerform === "OnImageClicked") {
        console.log("image clicked success");
        Dispatch(setRemotePage(9));
        handlePageChange(9);
        const _photoInfo = photoInfoRef.current;
        const isRetaking = _photoInfo.isRetaking;
        console.log("_photoInfo2", _photoInfo);
        if (isRetaking) {
          Dispatch(setIncreaseRetake());
          Dispatch(
            setPhotoInfo({
              photoPageStep: 1,
              selectedPhoto: null,
              openPhotoPreview: false,
              isRetaking: false,
            })
          );
        } else {
          const photoClicked = localStorage.getItem("photoClicked");
          console.log("photoClicked--------", photoClicked);
          Dispatch(
            setSessionInfo({
              photoClicked: Number(photoClicked),
            })
          );
        }
        const seq = localStorage.getItem("clickSequence");
        const comm = {
          ActionToPerform: "LogSave",
          PodActivityLog: {
            BoothId: localStorage.getItem("BoothId"),
            SessionId: localStorage.getItem("SessionId"),
            UserEmail: localStorage.getItem("userEmail"),
            LogType: "success",
            LogMsg: `camera being clicked. SessionId: ${localStorage.getItem(
              "SessionId"
            )}. Retake:${isRetaking}. Sequence: ${seq}`,
          },
        };
        hubConnection
          .invoke("SendCommandToWinClient", comm)
          .catch((err) => console.error("ERROR" + err));

        const afterClickCommand = {
          ...hubCommendRef.current,
          ActionToPerform: "Stage9",
          Remote: 9,
          Viewer: 6,
          ActivePosition: 3,
          ImageSequence: seq,
          ActivePosition: 1,
        };
        delete afterClickCommand.customLightSettings;
        //start live view again
        hubConnection
          .invoke("SendCommandToWinClient", afterClickCommand)
          .catch((err) => console.error("ERROR" + err));
        hubConnection
          .invoke("SendCommandToWebClient", {
            ...afterClickCommand,
            ActionToPerform: "viewer",
          })
          .catch((err) => console.error("ERROR" + err));
      }

      if (result.actionToPerform === "onCheckCamera") {
        const comm = {
          ActionToPerform: "LogSave",
          PodActivityLog: {
            BoothId: localStorage.getItem("BoothId"),
            SessionId: localStorage.getItem("SessionId"),
            LogType: "success",
            LogMsg: `camera being checked. BoothId: ${localStorage.getItem(
              "BoothId"
            )}. Status:${result.imageData}`,
          },
        };
        hubConnection
          .invoke("SendCommandToWinClient", comm)
          .catch((err) => console.error("ERROR" + err));
        console.log("onCheckCamera");
        if (result.imageData === "True") {
          Dispatch(setBoothActivity({ isCameraConnected: true }));
        } else {
          Dispatch(setBoothActivity({ isCameraConnected: false }));
        }
      }
    });
  }, [hubConnection, Dispatch]);

  const sendLog = useCallback(
    ({
      BoothId,
      SessionId,
      LogType,
      LogMsg,
      userEmail,
      BoothMode,
      userName,
      BoothName,
    }) => {
      if (!hubConnected) return;
      const comm = {
        ActionToPerform: "LogSave",
        PodActivityLog: {
          BoothName: BoothName || localStorage.getItem("BoothName"),
          BoothId: BoothId || localStorage.getItem("BoothId"),
          SessionId: SessionId || localStorage.getItem("SessionId"),
          UserEmail: userEmail || localStorage.getItem("userEmail"),
          UserName: userName || localStorage.getItem("userName"),
          LogType: LogType,
          LogMsg: LogMsg,
          Mode: BoothMode || localStorage.getItem("BoothMode"),
        },
      };
      console.log("logging", comm);

      hubConnection
        .invoke("SendCommandToWinClient", comm)
        .catch((err) => console.error("ERROR" + err));
    },
    [hubConnection, hubConnected]
  );

  const winHubConnection = useCallback(
    (command) => {
      if (!hubConnected) return;
      const _command = {
        ...hubCommendRef.current,
        ...command,
      };

      if (!["Stage6", "Stage8_1"].includes(_command.ActionToPerform)) {
        delete _command.customLightSettings;
      }

      hubCommendRef.current = _command;
      console.log("win com", _command);
      hubConnection
        .invoke("SendCommandToWinClient", _command)
        .catch((err) => console.error("ERROR" + err));
    },
    [hubConnection, hubConnected]
  );

  const webHubConnection = useCallback(
    (command) => {
      if (!hubConnected) return;
      const _command = {
        ...hubCommendRef.current,
        ...command,
      };
      hubCommendRef.current = _command;
      hubConnection
        .invoke("SendCommandToWebClient", _command)
        .catch((err) => console.error("ERROR" + err));
    },
    [hubConnection, hubConnected]
  );

  const checkCamera = () => {
    console.log("camera checking");
    winHubConnection({ ActionToPerform: "checkCamera" });
    sendLog({ LogMsg: "Camera checking", LogType: "success" });
  };

  useEffect(() => {
    if (hubConnection == null || !hubConnected) return;
    checkCamera();
  }, [hubConnection, hubConnected]);

  const handlePageChange = useCallback(
    (remoteStage) => {
      if (!hubConnected) return;
      console.log("handle callback--00~~~~");
      let viewerStep = 0;
      switch (remoteStage) {
        case 1:
        case 100:
          viewerStep = 1;
          break;
        case 21:
        case 22:
          viewerStep = 2;
          break;
        case 8:
          viewerStep = 5;
          break;
        case 12:
          viewerStep = 4;
          break;

        default:
          viewerStep = 3;
          break;
      }

      let currentStage = {
        remote: remoteStage,
        viewer: viewerStep,
        activePosition: 1,
      };

      const command = {
        ...hubCommendRef.current,
        ActionToPerform: "Stage" + remoteStage,
        Remote: currentStage.remote,
        Viewer: currentStage.viewer,
        ActivePosition: currentStage.activePosition,
      };
      hubCommendRef.current = command;

      webHubConnection({ ...command, ActionToPerform: "viewer" });
      console.log("web viewer commit", {
        ...command,
        ActionToPerform: "viewer",
      });

      winHubConnection(command);
      sendLog({
        LogType: "success",
        LogMsg: `Change page route. Remote:${remoteStage}, Viewer:${viewerStep}`,
      });
      console.log("win command", command);
    },
    [hubConnected, webHubConnection, winHubConnection, sendLog]
  );
  useEffect(() => {
    const command = {
      ...hubCommendRef.current,
      VoucherCode: sessionInfo.initiatedSession.coupon,
    };
    hubCommendRef.current = command;
  }, [sessionInfo.initiatedSession.coupon]);
  // on page change
  useEffect(() => {
    if (remotePage === 8) {
      handlePageChange(8);
    }
  }, [remotePage, handlePageChange]);

  //not using this
  const onStartLiveView = ({ presetId, hasError, coupon }) => {
    handlePageChange(6);
    console.log("pres comm", {
      Remote: 4,
      Viewer: 3,
      VoucherCode: coupon,
      PhotoPresetId: presetId,
      ActionToPerform: "getPhotoActionData",
      ActivePosition: 3,
    });

    winHubConnection({
      Remote: 6,
      Viewer: 3,
      VoucherCode: coupon,
      PhotoPresetId: presetId,
      ActionToPerform: "getPhotoActionData",
      ActivePosition: 3,
    });
    handlePageChange(6);
    sendLog({ LogMsg: "Staring live view.", LogType: "success" });
    // hubConnection
    //   .invoke("SendCommandToWinClient", {
    //     ActionToPerform: "OnLiveView",
    //   })
    //   .catch((err) => console.error("ERROR" + err));
  };
  const handleChangeLightZone = (zone) => {
    winHubConnection({
      ActionToPerform: "Stage6",
      VoucherCode: "",
      ImageSequence: 0,
      Remote: 6,
      Viewer: 4,
      ActivePosition: 3,
      customLightSettings: [zone],
    });
    console.log("zoneCommand", {
      ActionToPerform: "Stage6",
      VoucherCode: "",
      ImageSequence: 0,
      Remote: 6,
      Viewer: 4,
      ActivePosition: 3,
      customLightSettings: [zone],
    });

    // sendLog({ LogMsg: "Changing zone", LogType: "success" });
  };
  const handleClickPhoto = (sequence = 0) => {
    console.log("handle click");
    const isRetaking = photoInfo.isRetaking;
    let _sequence = sequence;
    if (isRetaking) {
      _sequence = parseInt(photoInfo.selectedPhoto);
      localStorage.removeItem("photoClicked");
    } else {
      _sequence = sessionInfo.photoClicked + 1;
      Dispatch(
        setSessionInfo({
          currentImageSequence: _sequence,
        })
      );
      localStorage.setItem("photoClicked", sessionInfo.photoClicked + 1);
    }
    localStorage.setItem("clickSequence", _sequence);
    const command = {
      ActionToPerform: "Stage8_1",
      VoucherCode: sessionInfo.initiatedSession.coupon,
      ImageSequence: _sequence,
      customLightSettings: [selectedZone],
      ActivePosition: 3,
      Remote: 6,
      Viewer: 4,
    };
    console.log("photo click command", command);
    if (_sequence == 0) {
      console.error("Sequence is 0");
    }
    setRecentClickSequence(_sequence);
    winHubConnection(command);
    // sendLog({
    //   LogMsg: `Clicking photo. Retaking:${isRetaking}, Sequence: ${_sequence}`,
    //   LogType: "success",
    // });
  };
  // after selecting light zone off the light
  const handleOffLight = () => {
    winHubConnection({
      ActionToPerform: "Stage7",
      Remote: 7,
      Viewer: 3,
    });
  };
  //final submit
  const _handleSubmitRef = useRef();
  const handleSubmit = () => {
    Dispatch(setRemotePage(12));
    handlePageChange(12);
    console.log("total photo clicked", sessionInfo.photoClicked);
    if (sessionInfo.photoClicked == 0) {
      console.log("no photo clicked -- not submitting");
      sendLog({
        LogMsg: `Submitting session without saving. SessionId:${sessionInfo.inviteInfo.sessionId}`,
        LogType: "success",
      });
      Dispatch(setSessionInfo({ sessionSubmitting: true }));
      return;
    }
    console.log("submitting");
    let favorite = photoInfo.favorite;
    if (!photoInfo.favorite) {
      favorite =
        Math.floor(Math.random() * Math.floor(sessionInfo.photoClicked)) + 1;
      Dispatch(setPhotoInfo({ favorite: favorite }));
    }
    const initiatedSession = sessionInfo.initiatedSession;
    let conducted_Session = {
      id: initiatedSession.id,
      name: initiatedSession.name,
      coupon: initiatedSession.coupon,
      inviteSent: initiatedSession.inviteSent,
      inviteAccepted: initiatedSession.inviteAccepted,
      sessionCompleted: initiatedSession.sessionCompleted,
      boothId: boothInfo.info.boothId,
      status: "CONDUCTED",
      userId: initiatedSession.userId,
      corporateOrderId: initiatedSession.corporateOrderId,
    };
    console.log("conducted_Session", conducted_Session);
    const command = { ...hubCommendRef.current };
    command.ActionToPerform = "saveSyncData";
    command.SessionId = sessionInfo.inviteInfo.sessionId;
    command.VoucherCode = initiatedSession.coupon;
    command.ClickAllowed = initiatedSession.clickAllowed;
    command.PhotoClicked = sessionInfo.photoClicked;
    command.PhotoRetaked = sessionInfo.photoRetake;
    command.IsFavoriteId = favorite;
    command.PhotoActionName = null;
    command.PhotoPresetId = null;
    command.Remote = 9;
    command.Viewer = 4;
    console.log("userInfo.phone", userInfo.phone);
    console.log("userInfo", userInfo);
    if (userInfo.phone != "") {
      command.ContactNumber = userInfo.phone;
    }
    command.customLightSettings = [selectedZone];
    console.log("saveSyncData", command);
    validateSession(sessionInfo.inviteInfo.sessionId)
      .then((res) => {
        console.log("update1")
        return updateSession(conducted_Session);
      })
      .then(() => {
        hubConnection
          .invoke("SendCommandToWinClient", command)
          .catch((err) => console.error("ERROR" + err));
        sendLog({
          LogMsg: `Submitting session. SessionId:${sessionInfo.inviteInfo.sessionId}`,
          LogType: "success",
        });
        Dispatch(setSessionInfo({ sessionSubmitting: true }));

      })
      .catch((er) => {
        console.log("err", er);
        sendLog({
          LogMsg: `Submitting session error happens. SessionId:${sessionInfo.inviteInfo.sessionId}`,
          LogType: "error",
        });
        Dispatch(setSessionInfo({ sessionSubmitting: true }));
      });
  };
  useEffect(() => {
    _handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  const handleBoothLoginCommand = useCallback(
    (BoothId, BoothName) => {
      if (!hubConnected) return;
      const comm = {
        ActionToPerform: "SaveBoothDetails",
        PodActivityLog: {
          BoothName: BoothName,
          BoothId: BoothId,
        },
      };
      console.log("SaveBoothDetails", comm);

      hubConnection
        .invoke("SendCommandToWinClient", comm)
        .catch((err) => console.error("ERROR" + err));
    },
    [hubConnection, hubConnected]
  );
  //in active and session time out
  useEffect(() => {
    let inactivityTimeout;
    let timeOutEndSession;
    const inactivityTime = 2 * 60 * 1000;
    const sessionTimeOutTime = 5 * 60 * 1000;
    if (!sessionInfo.orderFetched) return;
    const resetTimer = () => {
      clearTimeout(inactivityTimeout);
      clearTimeout(timeOutEndSession);
      inactivityTimeout = setTimeout(() => {
        Dispatch(
          setBoothActivity({
            isInactive: true,
          })
        );
        sendLog({
          LogMsg: `Booth is inactive. SessionId:${sessionInfo.inviteInfo.sessionId}`,
          LogType: "success",
        });
      }, inactivityTime);
      timeOutEndSession = setTimeout(() => {
        sendLog({
          LogMsg: `Session timeout. SessionId:${sessionInfo.inviteInfo.sessionId}`,
          LogType: "success",
        });
        _handleSubmitRef.current();
      }, sessionTimeOutTime);
    };

    const handleActivity = () => {
      Dispatch(
        setBoothActivity({
          lastActive: Date.now(),
          isInactive: false,
        })
      );
      resetTimer();
    };

    // Initial setup
    resetTimer();

    // Event listeners for user activity
    window.addEventListener("mousedown", handleActivity);
    // window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    // Clean up event listeners on component unmount
    return () => {
      clearTimeout(timeOutEndSession);
      clearTimeout(inactivityTimeout);
      window.removeEventListener("mousedown", handleActivity);
      // window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [sessionInfo.orderFetched, Dispatch, sendLog]);

  //swipe disable
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (sessionInfo.sessionSubmitting) return;
      console.log("-------------------");
      sendLog({
        LogMsg: `Prevent to reload.`,
        LogType: "success",
      });
      const message =
        "Are you sure you want to leave? Your changes may be lost.";
      event.preventDefault();
      // Standard for most browsers
      event.returnValue = message;

      // For some older browsers
      return message;
    };

    // Add the event listener when the component mounts
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate, sessionInfo.sessionSubmitting, sendLog]);
  return (
    <div>
      <SessionContext
        onPresetFetched={onStartLiveView}
        sendLog={sendLog}
        onPageChange={handlePageChange}
      >
        {remotePage === 1 && (
          <BoothLogin
            sendLog={sendLog}
            handleBoothLoginCommand={handleBoothLoginCommand}
          />
        )}
        {remotePage === 100 && <LandingPage onPageChange={handlePageChange} />}

        {/* default mode */}
        {remotePage === 21 && (
          <UserLogin
            onPageChange={handlePageChange}
            onCheckCamera={checkCamera}
            sendLog={sendLog}
          />
        )}
        {/* No order found */}
        {remotePage === 22 && (
          <NoOrderFound onPageChange={handlePageChange} sendLog={sendLog} />
        )}

        {remotePage === 6 && <PodInstruction onPageChange={handlePageChange} />}
        {remotePage === 4 && (
          <LightZone
            onPageChange={handlePageChange}
            changeLightZone={handleChangeLightZone}
            handleOffLight={handleOffLight}
          />
        )}
        {remotePage === 61 && <Pose onPageChange={handlePageChange} />}
        {remotePage === 7 && <Lookup sendLog={sendLog} />}
        {remotePage === 8 && <CountDownPage onPhotoClick={handleClickPhoto} />}
        {remotePage === 9 && (
          <ImagePreview
            onPageChange={handlePageChange}
            sequence={recentClickSequence}
          />
        )}
        {remotePage === 102 && (
          <PhotoPreview
            onPageChange={handlePageChange}
            sequence={recentClickSequence}
            onSubmit={handleSubmit}
            sendLog={sendLog}
          />
        )}
        {remotePage == 12 && <ExitSessionPage />}
        <CloseSession onSubmit={handleSubmit} />
        <InactivityModal onCheckCamera={checkCamera} />
        <Backdrop
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={boothInfo.activity.loading}
        >
          <CircularProgress size={60} />
        </Backdrop>
      </SessionContext>
    </div>
  );
}
