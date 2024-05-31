import { Curve, UniOn } from "assets/images";
import React, { Fragment, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { usePhotoRender } from "helper/func";
import { clearLocalStorageData } from "helper/func";

export default function ExitSessionPage() {
  const favoriteImage = useSelector((state) => state.photosInfo.favorite);
  const voucher = useSelector(
    (state) => state.sessionInfo.initiatedSession.coupon
  );
  const sessionInfo = useSelector((state) => state.sessionInfo);
  const picUrl = usePhotoRender(favoriteImage, voucher);
  const loadedTime = useRef(new Date());

  useEffect(() => {
    if (!sessionInfo.sessionSubmitting) return;
    const diffTime = Math.abs((new Date().getTime() - loadedTime.current.getTime()))
    const remainTime = 7000 - diffTime
    console.log("diffTime",remainTime);
    if(remainTime>100){
      setTimeout(() => {
        clearLocalStorageData();
        window.location = "/";
      }, remainTime);
    }
    else{
      clearLocalStorageData();
      window.location = "/";
    }
  }, [sessionInfo.sessionSubmitting]);

  return (
    <>
      <Fragment>
        <div className="exit_session_page">
          <div className="left_part">
            <div className="thank_you">
              <div className="content">
                <h2>
                  Thank you for <br /> visiting Studio Pod
                </h2>
                <p>
                  Check your email for instructions on how to view <br /> and
                  download your photos.
                </p>
              </div>
              <div className="unicorn_logo">
                <img src={Curve} className="curve" alt="curve" />
                <img src={UniOn} className="union" alt="union" />
              </div>
            </div>
            <div className="session_complete">
              <div className="content">
                <h2>Session Completed</h2>
              </div>
            </div>
            <div className="footer">
              <p>
                <span>Don’t forget to share and tag us</span>{" "}
                <b>@thestudiopod</b>{" "}
                <span>to be featured & for $10 off your next session.</span>
              </p>
            </div>
          </div>
          {favoriteImage && (
            <div className="right_part">
              <div className="image_part">
                <img src={picUrl} alt="model" />
              </div>
            </div>
          )}
        </div>
      </Fragment>
    </>
  );
}
