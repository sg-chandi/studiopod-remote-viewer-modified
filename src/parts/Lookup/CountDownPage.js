import React, { Fragment, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { arrowUp, curveSvg, unionSvg } from "assets/images/svg";
import { useSelector } from "react-redux";
import Header from "components/header/header";

const CountDownPage = ({ onPhotoClick }) => {
  const [count, setCount] = useState(5);
  const { userName } = useSelector((state) => state.userInfo);


  useEffect(() => {
    const countInterval = setInterval(() => {
      setCount(c => c - 1)
    }, 1000)
    const clearCountInterval = setTimeout(() => {
      clearInterval(countInterval)
      // setCount(5)
    }, 5500)
    return () => {
      clearInterval(countInterval)
      clearTimeout(clearCountInterval)
      setCount(5)
    }
  }, [])
  useEffect(() => {
    if (count == 0) {
      onPhotoClick()
      // Dispatch(setRemotePage(102))
      // onPageChange(102);
    }
  }, [count])
  return (
    <Fragment>
      <Header
        leftText={
          <p>
            <em> {userName.split(" ")[0]}<span className="opacity_fade">'s Studio Pod Session.</span></em>
          </p>
        }
        midText=""
        hideActionBtn={false}
        disableActionBtn={count !== 0}
      />
      {count === 0 ? (
        <div className="look_up_loader">
          <img src={unionSvg} alt="union" className="union" />
        </div>
      ) : (
        <div className="lookup_count_sec">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={12}
            className="PodInstructionHead"
          >
            <div className="arrow-up-bar">
              <img src={arrowUp} className="arrow" alt="arrow" />
              <h3>Look Up</h3>
              <img src={arrowUp} className="arrow" alt="arrow" />
            </div>
          </Stack>
          <div className="countDown_section">
            <div
              className={`left_part fadeInRight-fast ${count === 4 ? "w-25" : null
                } ${count === 3 ? "w-15" : null} ${count === 2 || count === 1 ? "d-none" : null
                }`}
            >
              <h3>Be ready in...</h3>
              <p>"It's time to start your photo shoot"</p>
            </div>
            <div
              className={`right_part fadeInUp ${count === 4 ? "w-75" : null} ${count === 3 ? "w-85" : null
                } ${count === 2 || count === 1 ? "w-100" : null}`}
            >
              <img src={curveSvg} alt="curve" className="curve" />
              <img src={unionSvg} alt="curve" className="union" />
              <div className="count_radius">
                <h2>{count === 1 ? null : <>{count}</>}</h2>
              </div>
              {2 > count && (
                <>
                  <div className="lookup_overlay">
                    <img src={arrowUp} className="arrow_up" alt="arrow" />
                    <h2>Look Up</h2>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default CountDownPage;
