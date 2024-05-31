import { imgFocus } from "assets/images";
import React from "react";
import { GoDotFill } from "react-icons/go";

const UserPhoto = ({ imageUrl, showHumanLayer, count = 0,mirror=false}) => {
  return (
    <div className="photo-content">
      <div className="photo">
        <span className="liveView">
          <GoDotFill color="#1aa81a" size="15" /> Live View ON
        </span>
        <img src={imageUrl} alt="userPhoto" className={`user_photo  ${mirror?"mirror_image":""}`} />
        <span className="safe_zone">Safe Zone</span>
        <div className={`radius ${count === 0 ? "d-none" : ""}`}>
          <span>{count}</span>
        </div>
      </div>
      {showHumanLayer ? (
        <div className="photo_overlay">
          <img src={imgFocus} alt="" />
        </div>
      ):null}
    </div>
  );
};

export default UserPhoto;
