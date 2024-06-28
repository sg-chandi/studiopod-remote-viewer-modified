import React, { useState, useContext, useEffect } from "react";
import PageInformation from "parts/pageInfo";
import NamePageComponent from "./NamePage";
import LoginImage from "assets/images/login_image.png";
import EmailPageComponent from "./EmailPage";
import EmailLoginImage from "assets/images/email_login_image.png";
import NameImage from "assets/images/name_image.png";
import { curveSvg, unionSvg } from "assets/images/svg";
import { useDispatch, useSelector } from "react-redux";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import Modal from "components/dialogue/Modal";
import { checkAvailableClients } from "service/remoteAPI";
import { setSessionInfo } from "state/reducers/sessionInfo";
import { useSessionContext } from "components/sessionFunctions/sessionContext";
import NumberKeyboard from "components/keyboard/numebrKeyboard";
import { setRemotePage } from "state/reducers/viewerSteps";
import {
  setUserLoggedIn,
  resetSateForUser,
} from "state/reducers/userInfoReducer";
import offlineMode from "state/reducers/offlineMode";
// default mode

export default function UserLogin({
  onCheckCamera,
  onPageChange,
  sendLog,
  sendCommandtoHub,
}) {
  const userData = useSelector((state) => state.userInfo);
  const boothInfo = useSelector((state) => state.booth.info);
  // const sessionInfo = useSelector((state) => state.sessionInfo);
  const [chooseCorporateModal, setChooseCorporateModal] = useState(false);
  const [availableCorporateInvites, setAvailableCorporateInvites] = useState(
    []
  );
  const Dispatch = useDispatch();
  const { createDailyModeOrder } = useSessionContext();
  const [showNamePage, setShoNamePage] = useState(true);
  const [nameFocused, setNameFocused] = useState(false);
  const [loading, setLocalLoading] = useState(false);
  const [selectedCorporate, setSelectedCorporate] = useState(null);
  const offlineMode = useSelector((state) => state.offline.offlineMode);
  const submitName = () => {
    setShoNamePage(false);
  };
  const focusName = () => {
    setNameFocused(true);
  };
  useEffect(() => {
    onCheckCamera();
  }, []);

  // useEffect(() => {
  //   const authToken = localStorage.getItem("authToken");
  //   if (!authToken) return;
  //   if (offlineMode != "online") return;
  //   sendCommandtoHub({
  //     ActionToPerform: "OfflineAuthenticate",
  //     authToken: authToken,
  //   });
  //   sendCommandtoHub({
  //     ActionToPerform: "IsBoothInDailyMode",
  //     authToken: authToken,
  //   });
  //   sendCommandtoHub({
  //     ActionToPerform: "StoreZonesetting",
  //     authToken: authToken,
  //   });
  // }, [sendCommandtoHub]);

  const handleLogin = () => {
    const name = userData.userName;
    const email = userData.userEmail;
    if (name && email && !loading) {
      setLocalLoading(true);
      sendLog({
        LogMsg: `User logged in. UserEmail:${email} `,
        LogType: "success",
        userEmail: email,
        userName: name,
      });
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      console.log(boothInfo);
      if (boothInfo.isDailyMode) {
        createDailyModeOrder(name, email, sendCommandtoHub);
        
      } else {
        checkAvailableClients(name, email)
          .then((res) => {
            setAvailableCorporateInvites(res.data);
            // multiple invites
            if (res.data?.length > 1) {
              setChooseCorporateModal(true);
            }
            //single invite
            else if (res.data.length === 1) {
              Dispatch(setUserLoggedIn(true));
              handleSelectCorporateClient({
                boothId: res.data[0]?.boothId,
                id: res.data[0]?.id,
              });
            }
            // not invited
            else {
              onPageChange(22);
              Dispatch(setRemotePage(22));
              Dispatch(resetSateForUser());
              localStorage.removeItem("userEmail");
              sendLog({
                LogMsg: `User no invitation found. UserEmail:${email} `,
                LogType: "error",
              });
            }
          })
          .catch((er) => {
            console.log("er", er);
            sendLog({
              LogMsg: `User login failed. UserEmail:${email} `,
              LogType: "error",
            });
          })
          .finally(() => {
            setLocalLoading(false);
          });
      }
    }
  };

  const handleClose = () => {
    setChooseCorporateModal(false);
  };
  const handleCorporateSelect = (client) => {
    setSelectedCorporate(client.id);
  };
  const handleSelectCorporateClient = async (corp) => {
    if (!selectedCorporate) {
      Dispatch(setUserLoggedIn(true));
      Dispatch(
        setSessionInfo({
          selectedCorporateClientID: corp.id,
          selectedBoothID: corp.boothId,
        })
      );
    } else {
      console.log("selectedCorporate", selectedCorporate);
      const found = availableCorporateInvites.find(
        (item) => item.id == selectedCorporate
      );
      Dispatch(setUserLoggedIn(true));
      Dispatch(
        setSessionInfo({
          selectedCorporateClientID: found?.id,
          selectedBoothID: found?.boothId,
        })
      );
    }
  };
  return (
    <div className="name_page">
      <div className="left_part">
        {!nameFocused && !boothInfo.isClubMode && (
          <motion.div
            initial={{ y: -15 }}
            animate={{ y: 0 }}
            transition={{ type: "tween", stiffness: 100, duration: 0.5 }}
          >
            <PageInformation />
          </motion.div>
        )}
        {boothInfo.isClubMode ? (
          <NumberKeyboard />
        ) : showNamePage ? (
          <motion.div
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ type: "tween", stiffness: 100, duration: 0.5 }}
            whileInView
          >
            <NamePageComponent
              setContainer={nameFocused}
              submitName={submitName}
              focusName={focusName}
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmailPageComponent
              setContainer={nameFocused}
              handleSubmit={handleLogin}
              loading={loading}
            />
          </motion.div>
        )}
        <motion.img
          initial={{ y: -15 }}
          animate={{ y: 0 }}
          transition={{ type: "tween", stiffness: 100, duration: 0.5 }}
          src={curveSvg}
          alt="curve"
          className="curve"
        />
        <motion.img
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ ease: "linear", duration: 0.7 }}
          src={unionSvg}
          alt="union"
          className="union"
        />
      </div>
      <div className="right_part">
        <div
          className="image_part"
          style={{ height: nameFocused ? "50%" : "100%" }}
        >
          {nameFocused ? (
            <motion.img
              initial={{ x: -15 }}
              animate={{ x: 0 }}
              transition={{ type: "tween", stiffness: 100, duration: 0.5 }}
              src={showNamePage ? NameImage : EmailLoginImage}
              alt="login_image"
              className="login_image"
            />
          ) : (
            <>
              <motion.img
                initial={{ x: -15 }}
                animate={{ x: 0 }}
                transition={{ type: "tween", stiffness: 100, duration: 0.5 }}
                src={LoginImage}
                alt="login_image"
                className="login_image"
              />
              <div className="footer_text">STUDIO POD © 2023</div>
            </>
          )}
        </div>
      </div>
      {/* Modal */}
      <Modal
        open={chooseCorporateModal}
        handleClose={handleClose}
        className="corporate_dialog studioPod_ModalUI"
      >
        <h2
          className="text-4xl text-black font-normal mt-0 mb-2"
          id="alert-dialog-title"
        >
          Choose your corporate
        </h2>
        <DialogContent>
          <p className="font-normal text-black mt-1 pr-40">
            your email ({userData.userEmail}) has multiple invites, please
            choose one for this session.
          </p>
          <div className="corporate_row mb-5">
            {availableCorporateInvites.map((item, index) => (
              <div
                className={`box ${
                  item.id === selectedCorporate ? "select" : ""
                }`}
                key={item.id}
                onClick={() => handleCorporateSelect(item)}
              >
                <div className="logo">
                  <img src={item.logoDB ? item.logoDB : ""} alt="holaImage" />
                </div>
                <span className="company_name">{item.name}</span>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button className="btn_cancel" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="btn_select" onClick={handleSelectCorporateClient}>
            Select
          </Button>
        </DialogActions>
      </Modal>
      {/* Modal */}
    </div>
  );
}
