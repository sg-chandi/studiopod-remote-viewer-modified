import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import FullPageLoader from "components/loader/fullPageLoader";
import { Box } from "@mui/material";
import {
  authenticate,
  getBoothDetails,
  checkBoothMode,
} from "service/remoteAPI";
import { jwtDecode } from "jwt-decode";
import {
  setBoothAuth,
  setBoothInfo,
  resetBooth,
  setBoothMode,
} from "state/reducers/boothInfo";
import { toast } from "react-toastify";
import { isBoothRole } from "helper/func";
import { useDispatch, useSelector } from "react-redux";
import { setRemotePage } from "state/reducers/viewerSteps";
import Form from "components/forms/form";
import { motion } from "framer-motion";
import { curveSvg, unionSvg } from "assets/images/svg";
import LoginImage from "assets/images/login_image.png";
import { setLoading } from "state/reducers/boothInfo";
import { clearLocalStorageData } from "helper/func";

const BoothLogin = ({ sendLog,handleBoothLoginCommand }) => {
  const boothAuth = useSelector((state) => state.booth.auth);
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(true);
  const [autoLoginTried, setAutoLoginTried] = useState(false);
  const [loading, setLocalLoading] = useState(false);
  const [loggedTryToken, setLoggedTryToken] = useState("idle"); //success failed

  const Dispatch = useDispatch();
  const handleEmailChange = useCallback((value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(value);
    setIsValidEmail(emailRegex.test(value));
  }, []);
  const isAutoLogin = process.env.REACT_APP_AUTO_LOGIN;
  const localToken = localStorage.getItem("BootUser");
  useLayoutEffect(() => {
    Dispatch(setLoading(true));
  }, []);
  const clearLogin = useCallback(() => {
    Dispatch(resetBooth);
    localStorage.clear();
  }, [Dispatch]);

  //login from token
  useEffect(() => {
    if (!localToken || boothAuth.loggedIn) return;
    const decodedToken = jwtDecode(localToken);
    const boothUserId = decodedToken.unique_name;
    const userEmail = decodedToken.sub;
    const roleIsBooth = isBoothRole(decodedToken.role);
    //booth data not found in local storage
    if (!roleIsBooth) {
      //  LOG
      clearLogin();
      setLoggedTryToken("failed");
    } else {
      //LOGIN success LOG
      Dispatch(
        setBoothAuth({
          boothEmail: userEmail,
          boothUserId: boothUserId,
          token: localToken,
          loggedIn: true,
        })
      );
      setLoggedTryToken("success");
    }
  }, [Dispatch, clearLogin, localToken, boothAuth.loggedIn]);

  //manual login
  const handleSubmit = useCallback(
    (_email, _password) => {
      setLocalLoading(true);
      if ((!_email || !_password) && (!email || !password)) return;

      authenticate(_email || email, _password || password)
        .then((res) => {
          if (res.data?.id_token) {
            try {
              const decodedToken = jwtDecode(res.data.id_token);
              const boothUserId = decodedToken.unique_name;
              // const userEmail = decodedToken.sub;
              const roleIsBooth = isBoothRole(decodedToken.role);
              if (!roleIsBooth) {
                //  LOG
                toast.error("Please login as Booth User.");
                clearLogin();
                sendLog({
                  LogMsg: `Booth Login failed. Wrong user. BoothEmail: ${email} `,
                  LogType: "error",
                });
              } else {
                //LOGIN success LOG
                localStorage.setItem("BootUser", JSON.stringify(res.data));
                localStorage.setItem("BoothUserEmail", JSON.stringify(email));
                sendLog({
                  LogMsg: `Booth Login success. BoothEmail: ${email} `,
                  LogType: "success",
                });
                Dispatch(
                  setBoothAuth({
                    boothEmail: email,
                    boothUserId: boothUserId,
                    token: res.data,
                    loggedIn: true,
                  })
                );
              }
            } catch (error) {
              // LOG
              toast.error("Something is wrong. Please try again!");
              setAutoLogin(false);
              clearLogin();
              sendLog({
                LogMsg: `Booth Login failed. BoothEmail: ${email} `,
                LogType: "error",
              });
            }
          } else {
            toast.error("Email or password is wrong.", {
              position: "top-center",
            });
            sendLog({
              LogMsg: `Booth Login failed. BoothEmail: ${email} `,
              LogType: "error",
            });
            setAutoLogin(false);
            clearLogin();
          }
        })

        .catch((res) => {
          //LOG
          toast.error("Email or password is wrong.", {
            position: "top-center",
          });
          clearLogin();
          sendLog({
            LogMsg: `Booth Login failed. BoothEmail: ${email} `,
            LogType: "error",
          });
          setAutoLogin(false);
        })
        .finally(() => {
          setLocalLoading(false);
          setAutoLogin(false);
        });
    },
    [email, password, Dispatch, clearLogin, sendLog]
  );
  useEffect(() => {
    //get booth data
    let fetchData = async () => {
      if (boothAuth.boothUserId) {
        Dispatch(setLoading(true));
        setLocalLoading(true);
        try {
          const boothDetails = await getBoothDetails(boothAuth.boothUserId);
          const boothDetailsData = boothDetails.data;
          Dispatch(
            setBoothInfo({
              boothName: boothDetailsData.name,
              boothId: boothDetailsData.id,
            })
          );
          localStorage.setItem("BoothId", boothDetailsData.id);
          localStorage.setItem("BoothName", boothDetailsData.name);
          const check_booth_mode = await checkBoothMode();

          Dispatch(
            setBoothMode({
              isDailyMode: Boolean(check_booth_mode?.data?.isDaily),
              isClubMode: Boolean(check_booth_mode?.data?.isClub),
            })
          );
          const mode = check_booth_mode?.data?.isDaily
            ? "daily"
            : check_booth_mode?.data?.isClub
            ? "club"
            : "normal";
            const prevMode =   localStorage.getItem("BoothMode")
            if(prevMode && prevMode !==mode){
              clearLocalStorageData()
              window.location = "/"
            }
          localStorage.setItem("BoothMode", mode);
          // CHANGE PAGE
          const viewerStepInfoJson = localStorage.getItem("viewerStepInfo");
          if (!viewerStepInfoJson) {
            Dispatch(setRemotePage(100));
          }
          setLocalLoading(false);
          setAutoLogin(false);
          Dispatch(setLoading(false));
          console.log("-------------------");
          handleBoothLoginCommand(boothDetailsData.id,boothDetailsData.name)
          sendLog({
            LogMsg: `Booth data fetched.  BoothId: ${boothDetailsData.id} `,
            LogType: "success",
            BoothMode: mode,
            BoothId:boothDetailsData.id,
            BoothName:boothDetailsData.name
          });
        } catch (error) {
          console.log("er", error);
          toast.error("Something is wrong. Please try again!2");
          setAutoLogin(false);
          setLocalLoading(false);
          clearLogin();
          sendLog({
            LogMsg: `Booth data fetched failed.  `,
            LogType: "error",
          });
        }
      }
    };
    fetchData();
    return () => (fetchData = null);
  }, [boothAuth.boothUserId, Dispatch, clearLogin, sendLog,handleBoothLoginCommand]);

  //auto login
  useEffect(() => {
    if ((localToken && loggedTryToken !== "failed") || autoLoginTried) return;
    if (isAutoLogin) {
      Dispatch(setLoading(true));
      fetch("/config.json")
        .then((response) => response.json())
        .then((data) => {
          if (data?.email?.trim() && data?.password) {
            console.log("data", data);
            setAutoLogin(true);
            setPassword(data.password);
            handleEmailChange(data.email.trim());
            handleSubmit(data.email.trim(), data.password);
            setAutoLoginTried(true);
          }
        })
        .catch(() => {
          setAutoLogin(false);
          setAutoLoginTried(true);
        })
        .finally(() => {
          Dispatch(setLoading(false));
        });
    } else {
      setAutoLogin(false);
    }
  }, [
    autoLoginTried,
    isAutoLogin,
    handleSubmit,
    loggedTryToken,
    localToken,
    handleEmailChange,
  ]);
  return (
    <div>
      {autoLogin ? (
        <Box></Box>
      ) : (
        <div className="name_page">
          <div className="left_part">
            {!emailSubmitted ? (
              <motion.div
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ type: "tween", stiffness: 100, duration: 0.5 }}
                whileInView
              >
                <Form
                  onFocus={() => setEmailFocused(true)}
                  title="Enter your user email"
                  subTitle={
                    email !== ""
                      ? "Tap continue when you’re done."
                      : "Tap to enter your email"
                  }
                  onSubmit={() => setEmailSubmitted(isValidEmail)}
                  inputType="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(value) => handleEmailChange(value)}
                  submitDisable={!isValidEmail || loading}
                  setContainer={emailFocused}
                />
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Form
                  onFocus={() => setEmailFocused(false)}
                  title="Enter your account password"
                  subTitle={
                    password !== ""
                      ? "Tap to enter your password"
                      : "Tap continue when you’re done."
                  }
                  onSubmit={handleSubmit}
                  inputType="password"
                  placeholder="*************"
                  value={password}
                  onChange={(value) => setPassword(value)}
                  submitDisable={password === "" || loading}
                  setContainer={!emailFocused}
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
              style={{ height: emailFocused ? "50%" : "100%" }}
            >
              {/* {emailFocused ? (
            <motion.img
              initial={{ x: -15 }}
              animate={{ x: 0 }}
              transition={{ type: "tween", stiffness: 100, duration: 0.5 }}
              src={showNamePage ? NameImage : EmailLoginImage}
              alt="login_image"
              className="login_image"
            />
          ) : (
            <> */}
              <motion.img
                initial={{ x: -15 }}
                animate={{ x: 0 }}
                transition={{ type: "tween", stiffness: 100, duration: 0.5 }}
                src={LoginImage}
                alt="login_image"
                className="login_image"
              />
              <div className="footer_text">STUDIO POD © 2023</div>
              {/* </>
          )} */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoothLogin;
