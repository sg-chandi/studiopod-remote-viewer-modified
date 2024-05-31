import React from "react";
import Union from "assets/images/Union.png";
import { useDispatch } from "react-redux";
import { setRemotePage } from "state/reducers/viewerSteps";
import { LandingImage } from "assets/images";

export default function LandingPage({ onPageChange }) {
  const Dispatch = useDispatch();
  //CHANGE PAGE
  return (
    <div
      className="landing_page"
      onClick={() =>{ Dispatch(setRemotePage(21));onPageChange(21)}}
    >
      <img src={LandingImage} className="landing_image" alt="landing_image" />

      <div className="landing_text">
        <h1>Touch anywhere to get started</h1>
      </div>
      <div className="landing_footer">
        <div>STUDIO POD © 2023</div>
        <img src={Union} alt="union_image" className="footer_img" />
      </div>
    </div>
  );
}
