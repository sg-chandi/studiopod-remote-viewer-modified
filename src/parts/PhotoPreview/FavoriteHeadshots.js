import React, { useEffect } from "react";
import AllImagesPreview from "./AllImagesPreview";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { Curve } from "../../assets/images";
import { Dialog, DialogContent } from "@mui/material";
import { setIsFavoriteOpen, setPhotoInfo } from "../../state/reducers/photosInfo";

const FavoriteHeadShots = ({ setShowFavoriteDialog, open }) => {
  const photoInfo = useSelector((state) => state.photosInfo);
  const selectedStep = photoInfo.photoPageStep;
  const Dispatch = useDispatch();


  const handleClose = () => {
    setShowFavoriteDialog(false);
    Dispatch(setIsFavoriteOpen(false))
    Dispatch(setPhotoInfo({
      modalOption: "retake"
    }))
  };


  return (
    // <div className="photoReview_section">

    //   <div
    //     className={`right_part ${
    //       selectedStep === 2 ? "bgwhite fadeIn-animation-1s" : ""
    //     } ${
    //       selectedStep === 3
    //         ? "bg-transparent p-0 retakeConfirm_part fadeIn-animation-1s"
    //         : ""
    //     }`}
    //   >
    //    <div> Choose your<br/> favorite headshots<br/> to be retouched</div>
    //    <p>Click your headshots to the right</p>
    //     <div className="crossIcon">
    //   <span
    //     className="cursor-pointer"
    //     onClick={onClose}
    //   >
    //     <img src={Curve} alt="curve" className="curve" />
    //     <RxCross1/>
    //     {/* <img src={RxCross1} alt="arrowLeft" className="arrow" /> */}
    //   </span>
    //   </div>
    //   </div>
    //   <div className=" favorite-right right_part bgwhite fadeIn-animation-1s">
    //     <AllImagesPreview />
    //   </div>
    // </div>
    <Dialog
      className="retouchedDialog retouch_view_modal"
      open={open}
      aria-labelledby="retouch-dialog-title"
      aria-describedby="retouch-dialog-description"
      onClose={handleClose}
    >
      <DialogContent>
        <div className="retouch_row">
          <div className="curve_section">
            <h2>
              Choose your <br /> favorite headshot <br /> to be retouched.
            </h2>
            <h3>
              Click your headshot to the <br /> right.
            </h3>
            <div className="cross_btn" onClick={handleClose}>
              <RxCross2 size="60" color="#f6f6f6" />
            </div>
          </div>
          <div className="photo_section">
              <AllImagesPreview />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FavoriteHeadShots;
