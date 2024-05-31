import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { setPhotoInfo } from "state/reducers/photosInfo";
export default function Photo({ url, sequence }) {
  const Dispatch = useDispatch();
  const photoInfo = useSelector((state) => state.photosInfo);
  const selectedImage = photoInfo.selectedPhoto
  const favorite = photoInfo.favorite
  const formatIndex = (number) => {
    return number.toString().padStart(2, "0");
  };

  const onSelect = () => {
    Dispatch(setPhotoInfo({
      selectedPhoto: sequence,
      openPhotoPreview: true,
      modalOption: "retake"
    }))
  }
  // favorite
  const openFavoriteConfirmModel = () => {
    Dispatch(setPhotoInfo({
      photoPageStep:2,
      selectedPhoto: sequence,
      openPhotoPreview: true,
      modalOption: "favorite"
    }))
  }
  return (
    <>
      {url ? (
        <>
          <div
            className={selectedImage === sequence ? "photo overlay" : "photo"}
          >
            <div className="radius">{formatIndex(sequence)}</div>
            <span className={`heartIcons ${favorite === sequence ? "active" : ""}`} onClick={openFavoriteConfirmModel} >
              <FaRegHeart />
            </span>
            <img
              src={url}
              className="photoImage"
              alt="photo_preview"
              onClick={onSelect}
            />
          </div>
        </>
      ) : (
        <div className="photo">
          <div
            className={
              selectedImage === sequence
                ? "radius opacity-100"
                : "radius opacity-25"
            }
          >
            {formatIndex(sequence)}
          </div>
        </div>
      )}
    </>
  );
}
