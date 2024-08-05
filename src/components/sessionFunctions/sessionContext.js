import { useContext, createContext,useState,useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  corporateDefaultOrder,
  validateSession,
  updateSession,
  getCorporatePreset,
  getBoothPreset,
  dailyOrderCreate,
  clubOrderCreate,
  getClientLightZone,
} from "service/remoteAPI";
import {
  setSessionInviteInfo,
  setSessionInfo,
  setSessionInitiated,
} from "state/reducers/sessionInfo";
import { setRemotePage } from "state/reducers/viewerSteps";
import { getBoothZoneSetting } from "service/remoteAPI";
import {
  setZoneFetched,
  setLightZone,
  setZoneInfo,
  setClientZone,
} from "state/reducers/lightZoneSetting";
import { setBoothActivity, setLoading } from "state/reducers/boothInfo";
import { setSteps } from "state/reducers/steps";
import { setViewerSteps } from "state/reducers/viewerSteps";
import { setPhotoInfo } from "state/reducers/photosInfo";
import { setExitSessionModal } from "state/reducers/modalInfo";
import {
  setUserLoggedIn,
  resetSateForUser,
  setUser,
} from "state/reducers/userInfoReducer";
import * as signalR from "@microsoft/signalr";
import { SIGNAL_R_CONNECTION } from "service/endpoints";

export const AppContext = createContext({ corporateDefaultOrder: () => {} });

const SessionContext = ({
  children,
  onPresetFetched,
  sendLog,
  onPageChange,
}) => {
  const userData = useSelector((state) => state.userInfo);
  const sessionInfo = useSelector((state) => state.sessionInfo);
  const boothInfo = useSelector((state) => state.booth.info);
  const boothData = useSelector((state) => state.booth);
  const boothLightZone = useSelector((state) => state.lightZone);

  const stepInfo = useSelector((state) => state.steps);
  const viewerStepInfo = useSelector((state) => state.viewerStep);
  const photosInfo = useSelector((state) => state.photosInfo);
  const modalInfo = useSelector((state) => state.modalInfo);
  const [hubConnection, setHubConnection] = useState(null);
  const hubCommendRef = useRef({
    ActionToPerform: "viewer",
    VoucherCode: "",
    ImageSequence: 0,
    Remote: 1,
    Viewer: 1,
    ActivePosition: 0,
    // PhotoPresetId:null
  });

  const Dispatch = useDispatch();

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

  // after booth login booth zone setting fetch



  useEffect(() => {
    if (boothLightZone.zoneFetched || !boothInfo.boothId) return;
    getBoothZoneSetting()
      .then((res) => {
        if (res.status !== 204) {
          if (res.data) {
            // console.log("Booth res.data Set");
            const removeUnused = [];
            res.data?.zone.forEach((r) => {
              const validData = [
                "Default",
                "Shadow1",
                "Shadow2",
                "Full",
                "Mid Shadow",
              ];
              if (validData.includes(r.key)) {
                removeUnused.push(r);
              }
            });
            Dispatch(
              setLightZone({ zone: removeUnused, isActive: res.data.isActive })
            );
          }
        }
        Dispatch(setZoneFetched(true));
        sendLog({
          LogMsg: `Getting booth zone setting. BoothId: ${localStorage.getItem(
            "BoothId"
          )} `,
          LogType: "success",
        });
      })
      .catch((er) => {
        sendLog({
          LogMsg: `Getting booth zone setting failed. BoothId: ${localStorage.getItem(
            "BoothId"
          )} `,
          LogType: "error",
        });
      });
  }, [boothLightZone.zoneFetched, boothInfo.boothId, Dispatch, sendLog]);
  //fetch client light setting
  useEffect(() => {
    if (!sessionInfo.inviteInfo.corporateClientId) return;
    getClientLightZone(sessionInfo.inviteInfo.corporateClientId).then(
      (zone) => {
        console.log("99999999999999999999zine", zone);
        if (zone.data !== "") {
          let clientZone = { key: "Dark", value: zone.data };
          Dispatch(
            setClientZone({
              clientZoneAvailable: true,
              clientZone: clientZone,
            })
          );
        }
      }
    );
  }, [sessionInfo.inviteInfo.corporateClientId]);
  // after user login in normal mode. invite fetching
  //after selecting client
  useEffect(() => {
    const corporateId = sessionInfo.selectedCorporateClientID;
    const boothId = sessionInfo.selectedBoothID;
    if (
      sessionInfo.orderFetched ||
      !corporateId ||
      boothId == null ||
      boothInfo.isDailyMode ||
      boothInfo.isClubMode
    )
      return;
    let order = {
      inviteeEmail: userData.userEmail,
      inviteeName: userData.userName,
      corporateClientID: sessionInfo.selectedCorporateClientID,
      boothId: sessionInfo.selectedBoothID,
    };
    Dispatch(setLoading(true));
    corporateDefaultOrder(order)
      .then((res) => {
        const data = res.data;
        Dispatch(
          setSessionInviteInfo({
            activationKey: data.activationKey,
            appointmentId: data.appointmentId,
            coupon: data.coupon,
            inviteId: data.id,
            inviteName: data.name,
            sessionId: data.sessionId,
            user: data.user,
            userEmail: data.userEmail,
            corporateClientId: data.corporateClientId,
          })
        );
        localStorage.setItem("SessionId", data.sessionId);
        Dispatch(setSessionInfo({ orderFetched: true }));
        sendLog({
          LogMsg: `Getting default order. BoothId: ${localStorage.getItem(
            "BoothId"
          )} `,
          LogType: "success",
        });
      })
      .catch(() => {
        sendLog({
          LogMsg: `Getting default order failed. BoothId: ${localStorage.getItem(
            "BoothId"
          )} `,
          LogType: "error",
        });
      })
      .finally(() => {
        Dispatch(setLoading(false));
      });
  }, [sessionInfo, userData, Dispatch, boothInfo, sendLog]);

  // FOR DAILY MODE ORDER FETCH
  const createDailyModeOrder = (name, email) => {
    const payload = {
      price: 0,
      units: 1,
      transaxtionId: "",
      backgroundUrlUI: "",
      backgroundUrl: "",
      touchupService: false,
      backgroundServicePrice: null,
      touchupServicePrice: null,
      inviteeEmail: email,
      inviteeName: name,
    };
    Dispatch(setLoading(true));
    dailyOrderCreate(payload)
      .then((res) => {
        const data = res.data;
        Dispatch(setUserLoggedIn(true));
        Dispatch(
          setSessionInviteInfo({
            activationKey: data.activationKey,
            appointmentId: data.appointmentId,
            coupon: data.coupon,
            inviteId: data.id,
            inviteName: data.name,
            sessionId: data.sessionId,
            user: data.user,
            userEmail: data.userEmail,
            corporateClientId: data.corporateClientId,
          })
        );
        localStorage.setItem("SessionId", data.sessionId);
        Dispatch(setSessionInfo({ orderFetched: true }));
        sendLog({
          LogMsg: `Creating daily order. BoothId: ${localStorage.getItem(
            "BoothId"
          )}, UserEmail:${email} `,
          LogType: "success",
        });
      })
      .catch(() => {
        sendLog({
          LogMsg: `Creating daily order failed. BoothId: ${localStorage.getItem(
            "BoothId"
          )}, UserEmail:${email} `,
          LogType: "success",
        });
        Dispatch(resetSateForUser(false));
      })
      .finally(() => {
        Dispatch(setLoading(false));
      });
  };

  // FOR CLUB MODE ORDER FETCH
  const createCLubModeOrder = (memberNumber) => {
    const payload = {
      price: 0,
      units: 1,
      transaxtionId: "",
      backgroundUrlUI: "",
      backgroundUrl: "",
      touchupService: false,
      backgroundServicePrice: null,
      touchupServicePrice: null,
      inviteeEmail: "",
      inviteeName: "",
      memberNumber: memberNumber,
    };
    Dispatch(setLoading(true));
    clubOrderCreate(payload)
      .then((res) => {
        const data = res.data;
        Dispatch(
          setUser({
            userName: memberNumber,
            userEmail: memberNumber,
            isLoggedIn: true,
          })
        );
        Dispatch(
          setSessionInviteInfo({
            activationKey: data.activationKey,
            appointmentId: data.appointmentId,
            coupon: data.coupon,
            inviteId: data.id,
            inviteName: data.name,
            sessionId: data.sessionId,
            user: data.user,
            userEmail: data.userEmail,
            corporateClientId: data.corporateClientId,
          })
        );
        localStorage.setItem("SessionId", data.sessionId);
        Dispatch(setSessionInfo({ orderFetched: true }));
        sendLog({
          LogMsg: `Creating club order. BoothId: ${localStorage.getItem(
            "BoothId"
          )}, MemberNumber:${memberNumber} `,
          LogType: "success",
        });
      })
      .catch(() => {
        sendLog({
          LogMsg: `Creating club order failed. BoothId: ${localStorage.getItem(
            "BoothId"
          )}, MemberNumber:${memberNumber} `,
          LogType: "error",
        });
      })
      .finally(() => {
        Dispatch(setLoading(false));
      });
  };
  //initiate session
  // omit checkZoneSettings for now TODO

  const InitialSession = useCallback(() => {
    Dispatch(setLoading(true));
    validateSession(sessionInfo.inviteInfo.sessionId)
      .then((response) => {
        const data = response.data;
        console.log( data.corporateClientDto.unlimited)

        let sessionCorporateId = null;
        // console.log("client data",data);
        let retakeAllowed = data.corporateClientDto?.retakesAllowed;
        let clickAllowed = data.corporateClientDto?.photosAllowed;
        if (data.corporateClientDto) {
          const isDaily = boothInfo.isDailyMode;
          // console.log("isDaily",isDaily);
          if (isDaily && data?.corporateClientDto?.dailyPhotosAllowed) {
            clickAllowed = data.corporateClientDto.dailyPhotosAllowed;
          }
          if (isDaily && data?.corporateClientDto?.dailyRetakesAllowed) {
            retakeAllowed = data.corporateClientDto.dailyRetakesAllowed;
          }
          // console.log("retakeAllowed",retakeAllowed);
          // console.log("clickAllowed",clickAllowed);
          console.log(data.corporateOrder);
          Dispatch(
            setSessionInfo({
              retakeAllowed: retakeAllowed,
              clickAllowed: clickAllowed,
              selectedCorporateClientID: data.corporateClientDto.id,
              isUnlimited:data?.corporateClientDto?.unlimited,
              touchupServicePrice:data?.corporateOrder?.touchupServicePrice,
              isUnlimitedStudio:data?.corporateOrder?.isUnlimited,
              isUnlimitedRetouching:data?.corporateClientDto?.unlimitedRetouching
            })
          );
          sessionCorporateId = data.corporateClientDto.id;
        }
        console.log("session status:", data.status);
        sendLog({
          LogMsg: `Validating session. SessionId: ${sessionInfo.inviteInfo.sessionId} `,
          LogType: "success",
        });
        if (
          data.status === "INVITEACCEPTED" ||
          data.status === "INITIATED" ||
          data.status === "CONDUCTED" ||
          data.status === "COMPLETED"
        ) {
          let initiatedSessionUser = {
            id: data.id,
            name: data.name,
            coupon: data.coupon,
            inviteSent: data.inviteSent,
            inviteAccepted: data.inviteAccepted,
            sessionCompleted: data.sessionCompleted,
            status: "INITIATED",
            boothId: boothInfo.boothId,
            userId: data.user.id,
            corporateOrderId: data.corporateOrder.id,
            retakeAllowed: retakeAllowed,
            clickAllowed: clickAllowed,
          };
          Dispatch(setSessionInitiated(initiatedSessionUser));
          Dispatch(setSessionInfo({ sessionFetched: true }));
          let initiatedSessionUserAPI = {
            id: data.id,
            name: data.name,
            coupon: data.coupon,
            inviteSent: data.inviteSent,
            inviteAccepted: data.inviteAccepted,
            sessionCompleted: data.sessionCompleted,
            status: "INITIATED",
            boothId: boothInfo.boothId,
            userId: data.user.id,
            corporateOrderId: data.corporateOrder.id,
          };
          console.log("update2");
          updateSession(initiatedSessionUserAPI)
            .then((response) => {
              sendLog({
                LogMsg: `Updating session. SessionId: ${sessionInfo.inviteInfo.sessionId} `,
                LogType: "success",
              });

              hubConnection.start().then(() => {
                console.log("Hub connected");
                hubConnection
                  .invoke("SendCommandToWinClient", {
                    ActionToPerform: "SaveSessionInitiatedInfo",
                  })
                  .catch((err) => console.error("ERROR" + err));
                console.log("SaveSessionInitiatedInfo", {
                  ...hubCommendRef.current,
                  ActionToPerform: "SaveSessionInitiatedInfo",
                });
        
              });

              if (sessionCorporateId != null) {
                // console.log("if selectedCorporateClientID")
                getCorporatePreset(data.corporateClientDto.id).then(
                  (response) => {
                    Dispatch(
                      setSessionInfo({
                        presetAvailable: response.data,
                        presetActionID: response.data.id,
                        hasError: false,
                        isValid: true,
                      })
                    );
                    onPresetFetched({
                      presetId: response.data.id,
                      coupon: data.coupon,
                    });
                  }
                );
              } else {
                // console.log(" else if response.data.boothId")
                getBoothPreset(response.data.boothId || boothInfo.boothId)
                  .then((response) => {
                    Dispatch(
                      setSessionInfo({
                        presetAvailable: response.data,
                        presetActionID: response.data.id,
                        hasError: false,
                        isValid: true,
                      })
                    );
                    onPresetFetched({
                      presetId: response.data.id,
                      coupon: data.coupon,
                    });
                  })
                  .finally(() => {
                    Dispatch(setLoading(false));
                  });
              }
            })
            .catch((e) => {
              sendLog({
                LogMsg: `Updating session failed. SessionId: ${sessionInfo.inviteInfo.sessionId} `,
                LogType: "error",
              });
            });
          // CHANGE PAGE
          Dispatch(setRemotePage(6));
        } else {
          //  clear session TODO
          sendLog({
            LogMsg: `Session initiated from another booth. SessionId: ${sessionInfo.inviteInfo.sessionId} `,
            LogType: "error",
          });
          toast.error("Session initiated from another booth");
        }
      })
      .catch((er) => {
        sendLog({
          LogMsg: `Validating session failed. SessionId: ${sessionInfo.inviteInfo.sessionId} `,
          LogType: "error",
        });
      });
  }, [sessionInfo.inviteInfo, Dispatch, boothInfo, sendLog]);
  // initiate session after invite fetch
  useEffect(() => {
    if (!sessionInfo.inviteInfo.sessionId || sessionInfo.sessionFetched) return;
    InitialSession();
  }, [
    sessionInfo.sessionFetched,
    sessionInfo.inviteInfo.sessionId,
    InitialSession,
  ]);
  // inactivity tracker

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      Dispatch(setBoothActivity({ hasInterConnection: navigator.onLine }));
      sendLog({
        LogMsg: `Internet disconnected. BoothId: ${localStorage.getItem(
          "BoothId"
        )} `,
        LogType: "error",
      });
    };
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, [sendLog]);
  // call only if booth login
  useEffect(() => {
    if (!boothData.auth.loggedIn) return;
    const userDataJson = localStorage.getItem("userData");
    const sessionInfoJson = localStorage.getItem("sessionInfo");
    const boothLightZoneJson = localStorage.getItem("boothLightZone");
    const stepInfoJson = localStorage.getItem("stepInfo");
    const viewerStepInfoJson = localStorage.getItem("viewerStepInfo");
    const photosInfoJson = localStorage.getItem("photosInfo");
    const modalInfoJson = localStorage.getItem("modalInfo");
    if (userDataJson) {
      const parsedData = JSON.parse(userDataJson);
      console.log("user data update from local");
      Dispatch(setUser(parsedData));
    }
    if (sessionInfoJson) {
      const parsedData = JSON.parse(sessionInfoJson);
      console.log("session data update from local");
      Dispatch(setSessionInfo(parsedData));
    }
    // if (boothLightZoneJson) {
    //   const parsedData = JSON.parse(boothLightZoneJson);
    //   console.log("booth data update from local");
    //   Dispatch(setZoneInfo(parsedData));
    // }
    if (stepInfoJson) {
      const parsedData = JSON.parse(stepInfoJson);
      console.log("step data update from local");
      Dispatch(setSteps(parsedData));
    }
    if (viewerStepInfoJson) {
      const parsedData = JSON.parse(viewerStepInfoJson);
      console.log("viewer data update from local");
      Dispatch(setViewerSteps(parsedData));
    }
    if (photosInfoJson) {
      const parsedData = JSON.parse(photosInfoJson);
      console.log("photo data update from local");
      Dispatch(setPhotoInfo(parsedData));
    }
    if (modalInfoJson) {
      const parsedData = JSON.parse(modalInfoJson);
      console.log("modal data update from local");
      Dispatch(setExitSessionModal(parsedData.exitSessionShow));
    }
  }, [boothData.auth.loggedIn, Dispatch]);

  useEffect(() => {
    if (!boothData.auth.loggedIn) return;
    const viewerStepInfoJson = localStorage.getItem("viewerStepInfo");
    if (viewerStepInfoJson) {
      const parsedData = JSON.parse(viewerStepInfoJson);
      console.log("viewer change page to", parsedData.remotePage);
      onPageChange(6);
      onPageChange(parsedData.remotePage);
    }
  }, [boothData.auth.loggedIn, Dispatch, onPageChange]);
  // saving data in local storage for entering same session after failed
  useEffect(() => {
    if (!userData.isLoggedIn) return;
    const userDataJson = JSON.stringify(userData);
    localStorage.setItem("userData", userDataJson);
  }, [userData, userData.isLoggedIn]);
  useEffect(() => {
    if (!userData.isLoggedIn) return;
    const sessionInfoJson = JSON.stringify(sessionInfo);
    localStorage.setItem("sessionInfo", sessionInfoJson);
  }, [sessionInfo, userData.isLoggedIn]);
  useEffect(() => {
    if (!userData.isLoggedIn) return;
    const boothLightZoneJson = JSON.stringify(boothLightZone);
    localStorage.setItem("boothLightZone", boothLightZoneJson);
  }, [boothLightZone, userData.isLoggedIn]);
  useEffect(() => {
    if (!userData.isLoggedIn) return;
    const stepInfoJson = JSON.stringify(stepInfo);
    localStorage.setItem("stepInfo", stepInfoJson);
  }, [stepInfo, userData.isLoggedIn]);
  useEffect(() => {
    if (!userData.isLoggedIn) return;
    const viewerStepInfoJson = JSON.stringify(viewerStepInfo);
    localStorage.setItem("viewerStepInfo", viewerStepInfoJson);
  }, [viewerStepInfo, userData.isLoggedIn]);
  useEffect(() => {
    if (!userData.isLoggedIn) return;
    const photosInfoJson = JSON.stringify(photosInfo);
    localStorage.setItem("photosInfo", photosInfoJson);
  }, [photosInfo, userData.isLoggedIn]);
  useEffect(() => {
    if (!userData.isLoggedIn) return;
    const modalInfoJson = JSON.stringify(modalInfo);
    localStorage.setItem("modalInfo", modalInfoJson);
  }, [modalInfo, userData.isLoggedIn]);

  return (
    <AppContext.Provider
      value={{ InitialSession, createDailyModeOrder, createCLubModeOrder }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useSessionContext = () => useContext(AppContext);
export default SessionContext;
