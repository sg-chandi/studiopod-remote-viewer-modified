import React, { useRef, useEffect, useState } from "react";
import CountingPart from "./CountingPart";
import AllImagesPreview from "./AllImagesPreview";
import SelectedImagePreview from "./SelectedImagePreview";
import ConfirmationModal from "./ConfirmationModal";
import { motion } from "framer-motion";
import RetakePhoto from "./RetakePhoto";
import Footer from "components/footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { setPhotoPage, setPhotoInfo } from "state/reducers/photosInfo";
import SMSDialogue from "./SMSDialogue";
import Header from "components/header/header";
import FavoriteHeadShots from "../PhotoPreview/FavoriteHeadshots";
import { FormatQuoteRounded } from "@mui/icons-material";
import * as signalR from "@microsoft/signalr";
import { SIGNAL_R_CONNECTION } from "service/endpoints";
import { setIsFavoriteOpen } from "../../state/reducers/photosInfo";

export default function PhotoPreview({ onSubmit, sendLog }) {
  const [SMSModal, setSMSModal] = useState(false);
  const [showFavoriteDialog, setShowFavoriteDialog] = useState(false);
  const Dispatch = useDispatch();
  const photoInfo = useSelector((state) => state.photosInfo);
  const { userName } = useSelector((state) => state.userInfo);
  const [disableCompleteSession, setDisableCompleteSession] = useState(false);
  const sessionInfo = useSelector((state) => state.sessionInfo);
  const [hubConnection, setHubConnection] = useState(null);
  const boothInfo = useSelector((state) => state.booth.info);
  const hubCommendRef = useRef({
    ActionToPerform: "viewer",
    VoucherCode: "",
    ImageSequence: 0,
    Remote: 1,
    Viewer: 1,
    ActivePosition: 0,
    // PhotoPresetId:null
  });

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

  const selectedStep = photoInfo.photoPageStep;
  const handleSubmitModal = () => {
    if (photoInfo.modalOption === "retake") {
      Dispatch(setPhotoPage(3));
    } else if (photoInfo.modalOption === "favorite") {
      Dispatch(
        setPhotoInfo({
          photoPageStep: 4,
          // selectedPhoto: null,
          openPhotoPreview: true,
          isRetaking: false,
          favorite: photoInfo.selectedPhoto,
          modalOption: "favoriteNew",
        })
      );
      sendLog({
        LogMsg: `Favorite selected. Sequence:${photoInfo.selectedPhoto}`,
        LogType: "success",
      });
    } else if (photoInfo.modalOption === "favoriteNew") {
      Dispatch(
        setPhotoInfo({
          photoPageStep: 2,
          selectedPhoto: null,
          openPhotoPreview: false,
          isRetaking: false,
          modalOption: "endSession",
        })
      );
      // sendLog({
      //   LogMsg: `Favorite selected. Sequence:${photoInfo.selectedPhoto}`,
      //   LogType: "success",
      // });
    } else if (photoInfo.modalOption === "endSession") {
      hubConnection.start().then(() => {
        console.log("Hub connected");
        hubConnection
          .invoke("SendCommandToWinClient", {
            ActionToPerform: "SaveSessionCompletedInfo",
          })
          .catch((err) => console.error("ERROR" + err));
        console.log("SaveSessionCompletedInfo", {
          ...hubCommendRef.current,
          ActionToPerform: "SaveSessionCompletedInfo",
        });
      });
      setSMSModal(true);
    }
  };

  const handleSubmitSession = () => {
    if (
      (boothInfo.isDailyMode && sessionInfo.isUnlimited) ||
      sessionInfo.touchupServicePrice || sessionInfo.isUnlimitedStudio || sessionInfo.isUnlimitedRetouching
    ) {
      setShowFavoriteDialog(true);
      if (!photoInfo.isFavouriteOpen) {
        Dispatch(setIsFavoriteOpen(true));
      }
      return;
    }
    Dispatch(setPhotoPage(3));
    Dispatch(
      setPhotoInfo({
        photoPageStep: 2,
        selectedPhoto: null,
        openPhotoPreview: false,
        isRetaking: false,
        modalOption: "endSession",
      })
    );
  };
  const handleFinalSubmit = () => {
    setTimeout(() => {
      onSubmit();
    }, [500]);
  };

  useEffect(() => {
    if (photoInfo.photoPageStep !== 1) {
      setDisableCompleteSession(true);
    } else {
      setDisableCompleteSession(false);
    }
  }, [photoInfo]);

  useEffect(() => {
    if (
      photoInfo.modalOption == "retake" ||
      photoInfo.modalOption == "favorite"
    ) {
      console.log(photoInfo.modalOption);
      setShowFavoriteDialog(false);
    }
  }, [photoInfo.modalOption]);

  return (
    <>
      {showFavoriteDialog && (
        <FavoriteHeadShots
          setShowFavoriteDialog={setShowFavoriteDialog}
          open={showFavoriteDialog}
        />
      )}
      <Header
        leftText={
          <p>
            <em>
              {" "}
              {userName.split(" ")[0]}
              <span className="opacity_fade">'s Studio Pod Session.</span>
            </em>
          </p>
        }
      />
      <div className="photoReview_section">
        <motion.div
          className="left_part"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "tween", duration: 0.6 }}
        >
          {photoInfo.openPhotoPreview ? (
            <SelectedImagePreview />
          ) : (
            <CountingPart />
          )}
        </motion.div>

        <div
          className={`right_part ${selectedStep === 2 ? "bgwhite fadeIn-animation-1s" : ""
            } ${selectedStep === 3
              ? "bg-transparent p-0 retakeConfirm_part fadeIn-animation-1s"
              : ""
            }`}
        >
          {selectedStep === 2 || selectedStep === 4 ? (
            <ConfirmationModal onSubmit={handleSubmitModal} />
          ) : selectedStep === 3 ? (
            <RetakePhoto sendLog={sendLog} />
          ) : (
            <AllImagesPreview />
          )}
        </div>
      </div>
      <SMSDialogue
        open={SMSModal}
        setOpen={(v) => setSMSModal(v)}
        onSubmit={handleFinalSubmit}
        sendLog={sendLog}
      />

      <Footer
        hideActionButton={disableCompleteSession}
        actionBtnText={"Complete session"}
        disableActionBtn={disableCompleteSession}
        onClickActionBtn={handleSubmitSession}
      />
    </>
  );
}
