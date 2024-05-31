import React, { useState } from "react";
import Keyboard from "react-simple-keyboard";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useSessionContext } from "components/sessionFunctions/sessionContext";

const NumberKeyboard = ({onSubmit}) => {
    const [input, setInput] = useState("");
    const [layout, setLayout] = useState("default");
    const [keyBoard, setKeyBoard] = useState(null)
    const { createCLubModeOrder } = useSessionContext()

    const onChange = (input) => {
        console.log(input.length);
        if (input.length <= 4) {
            setInput(input);
        }
    };
    const onKeyPress = (button) => {
        if (button === "{enter}") {
            if (input.length !== 4) {
                toast.error("Enter valid member number")
            }
            else{
                createCLubModeOrder(input)
            }
            console.log("enter", input);
        };
    };
    const handleInput = (event) => {
        onChange(event.target.value)
        if (keyBoard) {
            keyBoard.setInput(event.target.value)
        }
    }
    return (
        <div className="lower_part">
            <div className={`Container justify_Container`}>
                <div className="heading">
                    <div>Enter four digit member number</div>
                    <div className="desc">
                        {"Tap enter when you’re done."}
                    </div>
                </div>
                <div className="content">
                    <TextField
                        className="name_field"
                        placeholder="Enter member number"
                        value={input}
                        InputProps={{
                            sx: {
                                border: "none",
                                outline: "none",
                            },
                        }}
                        onChange={handleInput}
                        type="number"
                    />

                    <Keyboard
                        keyboardRef={(r) => setKeyBoard(r)}
                        layoutName={layout}
                        onChange={onChange}
                        onKeyPress={onKeyPress}

                        layout={{
                            default: ["1 2 3", "4 5 6", "7 8 9", "0 {bksp} {enter}"],
                        }}
                        display={{
                            "{bksp}": "delete",
                            "{enter}": "enter"
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default NumberKeyboard;
