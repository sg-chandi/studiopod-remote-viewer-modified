import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRemotePage } from "state/reducers/viewerSteps";
import { PHOTO_SESSION_BASEURL } from "service/endpoints";
import Header from "components/header/header";

export default function ImagePreview({ onPageChange, sequence }) {
  const sessionInfo = useSelector((state) => state.sessionInfo);
  const { userName } = useSelector((state) => state.userInfo);
  const Dispatch = useDispatch();
  let liveTime = new Date().getTime();
  const selectedPhoto =
    PHOTO_SESSION_BASEURL +
    sessionInfo.initiatedSession.coupon +
    "/" +
    sequence +
    "_thumb.jpg?recent" +
    liveTime

  useEffect(() => {
    setTimeout(() => {
      Dispatch(setRemotePage(102));
      onPageChange(102)
    }, 4000);
  }, [Dispatch, onPageChange]);
  return (
    <>
    <Header
     leftText={
      <p>
        <em> {userName.split(" ")[0]}<span className="opacity_fade">'s Studio Pod Session.</span></em>
      </p>
    }
    />
    <div className="look_up_loader userImage">
      <img src={selectedPhoto} alt="user_image" className="user_image" />
    </div>
    </>
  );
}
