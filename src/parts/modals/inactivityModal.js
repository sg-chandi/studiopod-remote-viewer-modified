import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { UniOn } from "assets/images";
import { useDispatch, useSelector } from "react-redux";
import { setBoothActivity } from "state/reducers/boothInfo";
import offlineMode, { setOfflineMode } from "state/reducers/offlineMode";

const InactivityModal = ({ onCheckCamera }) => {
  const boothActivity = useSelector((state) => state.booth.activity);
  const [refresh, setRefresh] = useState(false);
  const [cameraConnectTimer, setCameraConnectTimer] = useState(30);
  const Dispatch = useDispatch();
  const offlineMode = useSelector((state) => state.offline.offlineMode);

  useEffect(() => {
    if (boothActivity.isCameraConnected) return;
    const timer = setInterval(() => {
      setCameraConnectTimer((c) => c - 1);
    }, 1000);
    const timer2 = setTimeout(() => {
      clearInterval(timer);
    }, 31000);
    return () => {
      clearInterval(timer);
      clearTimeout(timer2);
    };
  }, [boothActivity.isCameraConnected, refresh]);

  useEffect(() => {
    let timer;
    if (cameraConnectTimer <= 0) {
      onCheckCamera();
      timer = setTimeout(() => {
        setCameraConnectTimer(30);
        setRefresh((e) => !e);
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [cameraConnectTimer]);

  useEffect(() => {
    const activeSession = () => {
      Dispatch(
        setBoothActivity({
          lastActive: Date.now(),
          isInactive: false,
        })
      );
    };
    window.addEventListener("mousedown", activeSession);
    // window.addEventListener("mousemove", activeSession);
    window.addEventListener("keydown", activeSession);
    window.addEventListener("touchstart", activeSession);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("mousedown", activeSession);
      // window.removeEventListener("mousemove", activeSession);
      window.removeEventListener("keydown", activeSession);
      window.removeEventListener("touchstart", activeSession);
    };
  }, []);


  return (
    <>
      <Dialog
        open={
          boothActivity.isInactive ||
          !boothActivity.isCameraConnected ||
          (!boothActivity.hasInterConnection && offlineMode==="online")
        }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="sessionDialogue"
        transitionDuration={{ exit: 0 }}
      >
        <DialogContent>
          <div className="still_content">
            {boothActivity.isInactive && (
              <>
                <h2>
                  Are you <br />
                  still there?
                </h2>
                <p>Click anywhere to keep your session active.</p>
              </>
            )}
            {!boothActivity.isCameraConnected && (
              <>
                <h2>
                  Camera is not
                  <br />
                  connected.
                </h2>
                <p>
                  {cameraConnectTimer > 0
                    ? `Reconnecting in ${cameraConnectTimer} sec`
                    : "Reconnecting.."}
                </p>
              </>
            )}
            {(!boothActivity.hasInterConnection && offlineMode==="online") && (
              <>
                <h2>
                  Internet connection <br />
                  lost
                </h2>
                {/* <p>Click anywhere to keep your session active.</p> */}
              </>
            )}
            {/* {!boothActivity.hasInterConnection && (
              <>
                <h2>
                  Internet connection <br />
                  lost
                </h2> */}
            {/* <p>Click anywhere to keep your session active.</p> */}
            {/* </> */}
            {/* )} */}
          </div>
          <div className="logo_absolute">
            <img src={UniOn} alt="curve" className="union" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InactivityModal;
