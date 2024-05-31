import React from "react";
import { namImage } from "assets/images";
import { IoArrowDown } from "react-icons/io5";

const Home = () => {
  return (
    <div className="homeScreen">
      <div className="image_part">
        <img src={namImage} alt="loginImage" />
      </div>
      <div className="touch_remote" >
        <div className="content">
          <h2>
            Touch the Studio Pod <br /> Remote to get started
          </h2>
          <IoArrowDown color="black" />
        </div>
      </div>
    </div>
  );
};

export default Home;
