import React from "react";
import Dialog from "@mui/material/Dialog";
import { UniOn } from "assets/images";

const Modal = ({ open, handleClose, children, className }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={`studioPod_ModalUI ${className}`}
    >
      <div className="logo_absolute">
        <img src={UniOn} alt="curve" className="union" />
      </div>
      {children}
    </Dialog>
  );
};

export default Modal;
