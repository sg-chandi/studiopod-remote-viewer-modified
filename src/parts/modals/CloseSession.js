import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import ExitImage from "../../assets/images/exit_image.png";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { setExitSessionModal } from "state/reducers/modalInfo";
import { Grid, Box, Paper } from "@mui/material";

import { unionSvg } from "assets/images/svg";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#000",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function CloseSession({ onSubmit }) {
  const Dispatch = useDispatch();
  const { userName } = useSelector((state) => state.userInfo);
  const show = useSelector((state) => state.modalInfo.exitSessionShow);
  const handleClose = () => {
    Dispatch(setExitSessionModal(false));
  };
  const handleSubmit = () => {
    handleClose();
    onSubmit();
  };
  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title2"
      aria-describedby="alert-dialog-description2"
      // className="sessionDialogue"
      className="exit_session_dialogue"
      fullScreen
    >
      <DialogContent>
      <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={12}
      className="PodInstructionHead mx-0"
    >
      <div className="lftTxt">
        {/* {showBackButton && (
          <IconButton onClick={onBack} size="small" color="secondary" sx={{mr:1}}>
            <ArrowBackIcon />
          </IconButton>
        )} */}
        <p>
            <em> {userName.split(" ")[0]}<span className="opacity_fade">'s Studio Pod Session.</span></em>
          </p>
      </div>
        <>
            <Button
              variant="contained"
              className="exit_btn"
              onClick={handleClose}
            >
              Cancel
            </Button>
        </>
    </Stack>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          className="UseBxSec"
        >
          <div className="UseBxExit">
            <div className="imgPart">
              <img src={ExitImage} alt="exitImage" className="exitImg" />
            </div>
            <div className="contPart">
              <div className="headingTxt">
                Are you sure want <br /> to exit session?
              </div>
              <div className="btnSec">
                
                <Button
                  variant="contained"
                  className="noBtn"
                  onClick={handleClose}
                >
                  NO
                </Button>
                <Button
                  variant="contained"
                  className="yesBtn"
                  onClick={handleSubmit}
                >
                  YES
                </Button>
              </div>
            </div>
          </div>
        </Stack>
        {/* <Grid container sx={{ height: "calc(100vh - 100px)" }}>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                background: "#fff",
                height: "calc(100vh - 100px)",
              }}
            >
              <img src={ExitImage} alt="exitImage" className="exitImg" />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                background: "#fff",
                height: "calc(100vh - 100px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              className="contPart"
            >
              <div className="headingTxt">
                Are you sure want <br /> to exit session?
              </div>
              <div className="btnSec">
                <Button
                  variant="contained"
                  className="yesBtn"
                  onClick={handleSubmit}
                >
                  YES
                </Button>
                <Button
                  variant="contained"
                  className="noBtn"
                  onClick={handleClose}
                >
                  NO
                </Button>
              </div>
            </Box>
          </Grid>
        </Grid> */}
       <Grid container className="footerSec">
       <Grid item xs={12} md={12}>
        <Item>
          <div className="footLft">
            <p>STUDIO POD © 2023</p>
            <img src={unionSvg} alt="union_image" className="footer_img" />
          </div>
        </Item>
      </Grid>
       </Grid>
      </DialogContent>
    </Dialog>
  );
}
