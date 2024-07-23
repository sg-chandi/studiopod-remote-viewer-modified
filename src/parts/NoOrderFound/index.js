import { Box, IconButton, Typography } from "@mui/material";
import qrcode from "assets/images/qrcode/qrcode.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { setRemotePage } from "state/reducers/viewerSteps";
import { clearLocalStorageData } from "helper/func";
import { setSessionInfo, } from "state/reducers/sessionInfo";

const NoOrderFound = ({ onPageChange, sendLog }) => {
  const offlineMode = useSelector((state) => state.offline.offlineMode);
  const Dispatch = useDispatch()
  const handleBack = () => {
    const idle = JSON.stringify('idle')
    localStorage.setItem("mode", idle);
    clearLocalStorageData()
    sendLog({
      LogMsg: `Not invited user. `,
      LogType: "success",
      userEmail: null,
      userName: null,
    });
    // onPageChange(21)
    // Dispatch(setRemotePage(21))
    Dispatch(setSessionInfo({ sessionSubmitting: true }));
    setTimeout(() => {
      window.location = '/'
    }, 100)
  }
  return (
    <Box
      sx={{
        background: "#000",
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        p: 4,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "20px",
          top: "20px"
        }}
      >
        <IconButton onClick={handleBack}>
          <ArrowBackIcon color="secondary" />
        </IconButton>
      </Box>
      {
        offlineMode == 'offline' &&
        <Box>
          <Typography variant="h5" color={"#fff"}>
            There is no more  session
          </Typography>
        </Box>
      }

      {
        offlineMode == 'online' &&
        <Box>
          <Typography variant="h5" color={"#fff"}>
            No session found
          </Typography>
          <Typography variant="body1" color={"#fff"}>
            To book a session, <br />
            visit https://www.thestudiopod.com or scan the QR Code below!
          </Typography>
          <Box textAlign="center" mt={2}>
            <img src={qrcode} alt="qrcode" />
          </Box>
        </Box>
      }

    </Box>
  );
};
export default NoOrderFound;
