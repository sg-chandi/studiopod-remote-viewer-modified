import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { PiArrowCircleRightThin } from "react-icons/pi";
import PropTypes from "prop-types";

const Form = ({
  onSubmit = () => {},
  onFocus = () => {},
  onChange = () => {},
  setContainer,
  title,
  subTitle,
  inputType,
  placeholder,
  value,
  submitDisable
}) => {
  const handleSubmit = () => {
    onSubmit();
  };
  const onEnter = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <div className="lower_part">
      <div className={`Container ${setContainer ? "justify_Container" : ""}`}>
        <div className="heading">
          <div>{title}</div>
          <div className="desc">{subTitle}</div>
        </div>
        <div className="content">
          <TextField
            className="name_field"
            placeholder={placeholder}
            value={value}
            InputProps={{
              sx: {
                border: "none",
                outline: "none",
              },
            }}
            onChange={(event) => onChange(event.target.value)}
            onFocus={onFocus}
            onKeyDown={onEnter}
            type={inputType || "text"}
          />
          <div className="buttonSec">
            <Button
              variant={!submitDisable ? "contained" : "outlined"}
              className={!submitDisable ? "filledBtn colorBtn" : "filledBtn"}
              sx={{ display: "flex", justifyContent: "space-between" }}
              endIcon={<PiArrowCircleRightThin />}
              onClick={handleSubmit}
              disabled={submitDisable}
              fullWidth
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  setContainer: PropTypes.bool,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  inputType: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  submitDisable: PropTypes.bool.isRequired,
};
export default Form;
