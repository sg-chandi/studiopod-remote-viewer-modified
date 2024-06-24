import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Photo from "./Photo";
import { motion } from "framer-motion";
import { PHOTO_SESSION_BASEURL } from "service/endpoints";

export default function AllImagesPreview() {
  const sessionInfo = useSelector((state) => state.sessionInfo);
  const photoClicked = sessionInfo.photoClicked
  const photoAllowed = sessionInfo.initiatedSession.clickAllowed
  const currentImageSequence = sessionInfo.currentImageSequence

  const renderPhotos = useMemo(() => {
    let allImages = [];
    console.log("coupon ", sessionInfo.initiatedSession.coupon)
    for (let index = 1; index < photoAllowed+1; index++) {
      if (index <= currentImageSequence) {
        let liveTime = new Date().getTime();
        console.log(sessionInfo.initiatedSession.coupon)
        const url =
          PHOTO_SESSION_BASEURL +
          sessionInfo.initiatedSession.coupon +
          "/" +
          index +
          "_thumb.jpg?" +
          liveTime
        allImages.push({
          url: url,
          sequence: index
        })
      }
      else{
        allImages.push({
          url: null,
          sequence: index
        })
      }

    }
    return allImages
  }, [photoAllowed, photoClicked])

  console.log(renderPhotos)
  console.log(PHOTO_SESSION_BASEURL)
  console.log("photo ",photoAllowed, photoClicked)


  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
      className="photos_row"
    >
      {
        renderPhotos.map(e => {
          return (
            <Photo url={e.url} sequence={e.sequence} key={e.sequence}/>
          )
        })
      }

    </motion.div>
  );
}
