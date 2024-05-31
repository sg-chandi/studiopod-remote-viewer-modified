import { unionSvg } from "assets/images/svg";
import React from "react";
import Home from "parts/ViewerScreens/Home";
import Welcome from "parts/ViewerScreens/Welcome";
import LiveView from "parts/ViewerScreens/UserPhoto";
import SessionComplete from "parts/ViewerScreens/SessionComplete";
import { FaArrowUp } from "react-icons/fa6";
import * as signalR from "@microsoft/signalr";
import {
  LIVE_VIEW_BASE_URL,
  SIGNAL_R_CONNECTION,
  PHOTO_SESSION_BASEURL,
} from "service/endpoints";
import { useEffect, useState } from "react";
export default function Viewer() {
  const [viewerStep, setViewerStep] = useState(1);
  const [showHumanLayer, setShowHumanLayer] = useState(1);
  const [hubConnection, setHubConnection] = useState(null);
  const [liveImageUrl, setLiveImageUrl] = useState("");
  const [capturedImageUrl, setCapturedImageUrl] = useState("");
  const [count, setCount] = useState(5);
  const [counting, setCounting] = useState(5);
  useEffect(() => {
    const hub_Connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNAL_R_CONNECTION)
      .build();
    setHubConnection(hub_Connection);
  }, []);
  useEffect(() => {
    if (hubConnection == null) return;
    hubConnection.start().then(() => {
      console.log("Hub connected");
    });

    hubConnection.on("liveViewStarted", () => {
      console.log("live view started");
    });

    hubConnection.on("onWebCommandReceived", (result) => {
      // console.log("rreceived", result);
      // console.log("viewerr,", result.actionToPerform === "viewer");
      if (result.actionToPerform === "OnImageClicked") {
        setShowHumanLayer(false);
      }
      if (result.actionToPerform === "onError") {
        this.OnError();
      } else if (result.actionToPerform === "OnLiveView") {
        const liveImageUrl =
          LIVE_VIEW_BASE_URL + result.imageData + "?" + Date.now();
        setLiveImageUrl(liveImageUrl);
      } else if (result.actionToPerform === "viewer") {
        const viewerPage = JSON.parse(result.viewer);
        const remotePage = JSON.parse(result.remote);
        setShowHumanLayer(viewerPage != 5);
        // remotePage == 7 || remotePage == 8 || remotePage == 102
        console.log("viewerPage:", viewerPage, "remote:", remotePage);
        console.log("viewer result", result);
        if (viewerPage == 6) {
          const livetime = Date.now();
          let selectedImage =
            PHOTO_SESSION_BASEURL +
            result.voucherCode +
            "/" +
            result.imageSequence +
            "_thumb.jpg?" +
            livetime;
            console.log("imageSequence",result.imageSequence);
          setCapturedImageUrl(selectedImage);
        }
        setViewerStep(viewerPage);

        if (result.startCount) {
        }
        // this.setState({
        //   currentPage: JSON.parse(result.viewer),
        //   activePosition: JSON.parse(result.activePosition),
        // });
        // this.getSelectedImage(result.voucherCode, result.imageSequence);
      } else if (result.actionToPerform === "viewerPreset") {
        // console.log("viewerPreset", result.imageData);
        // this.getSelectedPresetImage(result.imageData);
      }
    });
  }, [hubConnection]);
  useEffect(() => {
    console.log("viewerStep-------------", viewerStep);
    if (viewerStep != 5) return;
    setCounting(true);
    const countInterval = setInterval(() => {
      setCount((c) => c - 1);
    }, 1000);
    const clearCountInterval = setTimeout(() => {
      clearInterval(countInterval);
      setCount(5);
      setCounting(false);
    }, 5500);
    return () => {
      clearInterval(countInterval);
      clearTimeout(clearCountInterval);
      setCount(5);
    };
  }, [viewerStep]);

  return (
    <div className="mobile_viewer">
      <div className="header flex-center">
        {viewerStep === 3 ? (
          <div className="flex-center flex-column w-100 user_photoHeader">
            <FaArrowUp color="white" size="20" />
            <p className="m-0">Look right into the camera lens above</p>
          </div>
        ) : (
          <>
            <h2 className="m-0">STUDIO POD</h2>
          </>
        )}
      </div>
      <div className="content-body">
        {viewerStep === 1 && <Home />}
        {viewerStep === 2 && <Welcome />}
        {(viewerStep === 3 || viewerStep === 5) && (
          <LiveView
            imageUrl={liveImageUrl}
            count={viewerStep == 5 && counting ? count : 0}
            showHumanLayer={showHumanLayer}
            mirror={true}
          />
        )}
        {viewerStep === 6 && (
          <LiveView
            imageUrl={capturedImageUrl}
            count={0}
            showHumanLayer={false}
            mirror={false}
          />
        )}
        {viewerStep === 4 && <SessionComplete />}
      </div>
      {viewerStep !== 3 && viewerStep !== 5 && viewerStep != 6 ? (
        <footer
          className={`${viewerStep === 2 ? "black-footer" : ""} ${
            viewerStep === 4 ? "black-footer" : ""
          }`}
        >
          <img src={unionSvg} alt="union" className="union" />
          <span>STUDIO POD © 2023</span>
        </footer>
      ) : null}
    </div>
  );
}
