import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { PiArrowCircleRightThin } from "react-icons/pi";
import { setUserNameAction } from "../../state/reducers/userInfoReducer";

export default function NamePage({ submitName, focusName, setContainer }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const changeName = (event) => {
    setName(event.target.value);
  };
  const setUserName = () => {
    dispatch(setUserNameAction(name));
    submitName();
  };
  const onEnter = (event) => {
    if (event.key === "Enter") {
      setUserName();
    }
  };
  return (
    <div className="lower_part">
      <div className={`Container ${setContainer ? "justify_Container" : ""}`}>
        <div className="heading">
          <div>What’s your name?</div>
          <div className="desc">
            {name ? "Tap continue when you’re done." : "Tap to enter your name"}
          </div>
        </div>
        <div className="content">
          <TextField
            className="name_field"
            placeholder="Enter your full name"
            value={name}
            InputProps={{
              sx: {
                border: "none",
                outline: "none",
              },
            }}
            onChange={(event) => changeName(event)}
            onFocus={focusName}
            onKeyDown={onEnter}
          />
          <div className="buttonSec">
            <Button
              variant={name ? "contained" : "outlined"}
              className={name ? "filledBtn colorBtn" : "filledBtn"}
              sx={{ display: "flex", justifyContent: "space-between" }}
              endIcon={<PiArrowCircleRightThin />}
              onClick={setUserName}
              disabled={name ? false : true}
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
