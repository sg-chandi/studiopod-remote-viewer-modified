import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { setUserEmailAction, setUserUINAction } from "state/reducers/userInfoReducer";
import { PiArrowCircleRightThin } from "react-icons/pi";
import TextField from '@mui/material/TextField';

export default function UINPage({ handleSubmit, setContainer, loading }) {
    const [UIN, setUIN] = useState();
    const Dispatch = useDispatch();
    const changeUIN = (event) => {
        setUIN(event.target.value);
        Dispatch(setUserUINAction(event.target.value));
    };
    const UINRef = useRef(null)
    const submitForm = () => {
        UINRef.current?.blur()
        handleSubmit();
    }
    const onEnter = (event) => {
        if (event.key === "Enter") {
            submitForm()
        }
    };

    return (
        <div className="lower_part">
            <div className={`Container ${setContainer ? "justify_Container" : ""}`}>
                <div className="heading">
                    <div>What’s your UIN?</div>
                    <div className="desc">
                        {UIN
                            ? "Tap continue when you’re done."
                            : "Tap to enter your UIN"}
                    </div>
                </div>
                <div className="content">
                    <TextField
                        className="name_field"
                        type="number"
                        placeholder="Enter your UIN Number"
                        value={UIN}
                        InputProps={{
                            inputProps: {
                                style: {
                                    appearance: "textfield",
                                    MozAppearance: "textfield", // for Firefox
                                },
                            },
                            style: {
                                border: "none",
                            },
                        }}
                        onChange={(event) => changeUIN(event)}
                        onKeyDown={onEnter}
                        ref={UINRef}
                    />
                    <div className="buttonSec">
                    <Button
                            variant={!UIN || loading ? "outlined" : "contained"}
                            className={
                                !UIN || loading ? "filledBtn" : "filledBtn colorBtn"
                            }
                            sx={{ display: "flex", justifyContent: "space-between" }}
                            endIcon={<PiArrowCircleRightThin />}
                            disabled={!UIN || loading}
                            onClick={submitForm}
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
