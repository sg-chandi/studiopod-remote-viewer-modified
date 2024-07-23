import React from "react";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { photoInfoReducer, setIsFavoriteOpen, setPhotoInfo } from "state/reducers/photosInfo";
import { setIsFavoriteOpen } from "../../state/reducers/photosInfo";
export default function ConfirmationModal({ onSubmit }) {
  const modalData = useSelector((state) => state.photosInfo.modalOption);
  const photoInfo = useSelector((state) => state.photosInfo);
  const photoPageStep = useSelector((state) => state.photosInfo.photoPageStep);
  const Dispatch = useDispatch();
  const cancelRetake = () => {
    if(photoInfo.isFavouriteOpen){
      Dispatch(setIsFavoriteOpen(false))
    }
    Dispatch(setPhotoInfo({
      modalOption: "retake"
    }))
    Dispatch(
      setPhotoInfo({
        photoPageStep: 1,
        selectedPhoto: null,
        openPhotoPreview: false,
        isRetaking: false,
      })
    );
  };
  return (
    <motion.div
      initial={{ opacity: 0.2 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", delay: 0.3, duration: 0.6 }}
      className="retakeConfirmation_sec"
    >
      <h2>
        {modalData === "retake" ? (
          <>
            Would you like to <br /> retake this photo?
          </>
        ) : modalData === "favoriteNew" ? (
          <>
            This will be your photo
            <br />
            that is retouched
          </>
        ) : modalData === "favorite" ? (
          <>
            Would you like to make this
            <br /> your favorite photo to have
            <br /> retouched?
          </>
        ) : (
          <>
            Are you sure want to
            <br /> complete you session?
          </>
        )}
      </h2>
      <div className="button_grp">
        <Button className="secondary" onClick={cancelRetake}>
          {photoInfo.modalOption === "favoriteNew" ? "GO BACK" : "NO"}
        </Button>
        <Button className="primary" onClick={onSubmit}>
        {photoInfo.modalOption === "favoriteNew" ? "CONFIRM" : "YES"}
        </Button>
      </div>
    </motion.div>
  );
}
