import React, { useState ,useRef} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { setUserEmailAction } from "state/reducers/userInfoReducer";
import { PiArrowCircleRightThin } from "react-icons/pi";

export default function EmailPage({ handleSubmit, setContainer, loading }) {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const Dispatch = useDispatch();
  const changeEmail = (event) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(event.target.value);
    Dispatch(setUserEmailAction(event.target.value));
    setIsValidEmail(emailRegex.test(event.target.value));
  };
  const emailRef = useRef(null)
  const submitForm = ()=>{
    emailRef.current?.blur()
    handleSubmit();
  }
  const onEnter = (event) => {
    if (event.key === "Enter" && isValidEmail) {
      submitForm()
    }
  };
 
  return (
    <div className="lower_part">
      <div className={`Container ${setContainer ? "justify_Container" : ""}`}>
        <div className="heading">
          <div>What’s your email?</div>
          <div className="desc">
            {email
              ? "Tap continue when you’re done."
              : "Tap to enter your email"}
          </div>
        </div>
        <div className="content">
          <TextField
            className="name_field"
            placeholder="Enter your email"
            value={email}
            InputProps={{
              style: {
                border: "none",
              },
            }}
            onChange={(event) => changeEmail(event)}
            onKeyDown={onEnter}
            type="email"
            ref={emailRef}
          />
          <div className="buttonSec">
            <Button
              variant={!isValidEmail || loading ? "outlined" : "contained"}
              className={
                !isValidEmail || loading ? "filledBtn" : "filledBtn colorBtn"
              }
              sx={{ display: "flex", justifyContent: "space-between" }}
              endIcon={<PiArrowCircleRightThin />}
              disabled={!isValidEmail || loading}
              onClick={ submitForm}
              fullWidth
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
