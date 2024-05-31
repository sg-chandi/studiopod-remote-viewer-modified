import React from "react";
import { holaImage } from "assets/images";
import { IoArrowDown } from "react-icons/io5";
import { curveSvg, unionSvg } from "assets/images/svg";

const Welcome = () => {
  return (
    <>
      <div className="welcome_sec">
        <div className="hola_sec d-flex justify-content-between">
          <div className="upper_part">
            <div className="tag">Welcome</div>
          </div>
          <div className="down_part">
            <h2>Howdy!</h2>
          </div>
          <img src={curveSvg} alt="curve" className="curve" />
          <img src={unionSvg} alt="curve" className="union" />
        </div>
        <div className="instruction">
          <h3 className="m-0">Follow the instructions on Studio Pod remote</h3>
          <IoArrowDown color="black" />
        </div>
        <div className="image_part">
          <img src={holaImage} alt="loginImage" />
        </div>
      </div>
    </>
  );
};

export default Welcome;
