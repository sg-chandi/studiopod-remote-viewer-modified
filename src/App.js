import { Routes, Route } from "react-router-dom";
import Remote from "./pages/Remote";
import Status from "./pages/Status";
import Viewer from "./pages/Viewer";
import { useEffect, useState, lazy } from "react";
import { holaImage, UniOn } from "assets/images";
import * as allImage from "assets/images";
import { useDispatch } from "react-redux";
import { setImages } from "state/reducers/images";
import LandingImage from "assets/images/landing_image.png";
import imgLink from "assets/images/hola_image.png";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [imageCache, setImageCache] = useState([]);
  useEffect(() => {
    console.log("allImage", allImage);
    const images = [];
    for (const key in allImage) {
      if (Object.hasOwnProperty.call(allImage, key)) {
        const element = allImage[key];
        images.push({
          name: key,
          path: allImage[key],
        });
      }
    }
    const localCache = [];
    const handleImageLoad = (index) => {
      if (localCache?.[index]?.loaded) {
        localCache[index].loaded = true;
      }
      const allLoaded = images.every((_, i) => localCache?.[i]?.loaded);
      if (allLoaded) {
        setLoaded(true);
        setImageCache(localCache);
      }
    };
    images.forEach((img, index) => {
      if (localCache[index]) {
        return;
      }
      const newImg = new Image();
      newImg.src = img.path;
      const neValue = {
        ...img,
        imag: newImg,
        loaded: false,
      };
      localCache[index] = neValue;

      newImg.onload = () => handleImageLoad(index);
    });
  }, []);
  // console.log = ()=>{}
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Remote />} />
        <Route exact path="/viewer" element={<Viewer />} />
        <Route exact path="/status" element={<Status />} />
      </Routes>
    </>
  );
}

export default App;
