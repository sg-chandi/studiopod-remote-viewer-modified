import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { UniOn } from "assets/images";
import PhoneInput from 'react-phone-input-2'
import { setUserPhone } from "state/reducers/userInfoReducer";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import { toast } from "react-toastify";


const SMSDialogue = ({ open, setOpen, onSubmit,sendLog }) => {
  const Dispatch = useDispatch()
  const  phone = useSelector(state=>state.userInfo.phone)
  const handleSubmit = () => {
    if(phone.length < 8){
      toast.error("Please enter valid phone number.")
      return
    }
    sendLog({
      LogMsg: `Phone number added. Phone:${phone}`,
      LogType: "success",
    });
    // Dispatch(setUserPhone(phone))
    console.log("setting",phone);
    setOpen(false);
    onSubmit();
    // setTimeout(() => {
    // }, 300)
  };
  const handleSkip = () => {
    setOpen(false);
    sendLog({
      LogMsg: `Phone number skip.`,
      LogType: "success",
    });
    // onSubmit();
    onSubmit();
    // setTimeout(() => {

    // }, 100)
  };
  const handlePhoneChange = (data) => {
    console.log("data", data);
    Dispatch(setUserPhone(data))
  }
  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="sessionDialogue mobile_number_dialog"
      >
        <DialogTitle id="alert-dialog-title">
          Enter your mobile number to <br /> receive your photos via text
        </DialogTitle>
        <DialogContent>
          <label>Tap to enter your phone number</label>
          <div className="form_group">
            <Box my={3}>
              <PhoneInput
                country={'us'}
                value={phone}
                onChange={handlePhoneChange}
              />
            </Box>

          </div>
          <div className="logo_absolute">
            <img src={UniOn} alt="curve" className="union" />
          </div>
        </DialogContent>
        <DialogActions>
          <Button className="submitBtn" onClick={handleSubmit}>
            Submit
          </Button>
          <Button className="skipBtn" onClick={handleSkip}>
            Skip
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SMSDialogue;
