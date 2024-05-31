import { styled } from "@mui/material/styles";
import { Grid, Paper, Button } from "@mui/material";
import Union from "../../assets/images/Union.png";
import { PiArrowCircleRightThin } from "react-icons/pi";
import PropTypes from "prop-types";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#000",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Footer = ({
  hideActionButton,
  actionBtnText,
  disableActionBtn,
  onClickActionBtn = () => {},
  btnVariant,
  btnClassName,
  onSkip = () => {},
  skipButtonName,
  showSkip,
}) => {
  return (
    <>
      {showSkip ? (
        <>
          <Grid container className="footerSec items-center">
            <Grid
              item
              xs={hideActionButton ? 12 : 4}
              md={hideActionButton ? 12 : 6}
            >
              <Item className="flex gap-3 items-center">
                <div className="footLft flex-1">
                  <p>STUDIO POD © 2023</p>
                </div>
                <img
                  src={Union}
                  alt="union_image"
                  className="footer_img invert-white"
                  width="60"
                />
              </Item>
            </Grid>
            <Grid item xs={3} md={3}>
              <Item>
                <div className="srchBtn ml-[1px]">
                  <Button
                    variant="contained"
                    className="skipBtn"
                    fullWidth
                    endIcon={<PiArrowCircleRightThin />}
                    onClick={onSkip}
                  >
                    {skipButtonName}
                  </Button>
                </div>
              </Item>
            </Grid>
            <Grid item xs={3} md={3}>
              <Item>
                <div className="srchBtn">
                  <Button
                    variant={btnVariant || "contained"}
                    className={btnClassName}
                    fullWidth
                    endIcon={<PiArrowCircleRightThin />}
                    disabled={disableActionBtn}
                    onClick={onClickActionBtn}
                  >
                    {actionBtnText}
                  </Button>
                </div>
              </Item>
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid container className="footerSec">
          <Grid
            item
            xs={hideActionButton ? 12 : 6}
            md={hideActionButton ? 12 : 9}
          >
            <Item>
              <div className="footLft">
                <p>STUDIO POD © 2023</p>
                {!showSkip && (
                  <img src={Union} alt="union_image" className="footer_img" />
                )}
              </div>
            </Item>
          </Grid>
          {!hideActionButton && (
            <Grid item xs={6} md={3}>
              <Item>
                <div className="srchBtn">
                  <Button
                    variant={btnVariant || "contained"}
                    className={btnClassName}
                    fullWidth
                    endIcon={<PiArrowCircleRightThin />}
                    disabled={disableActionBtn}
                    onClick={onClickActionBtn}
                  >
                    {actionBtnText}
                  </Button>
                </div>
              </Item>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
};
Footer.propTypes = {
  hideActionButton: PropTypes.bool,
  actionBtnText: PropTypes.string,
  disableActionBtn: PropTypes.bool,
  onClickActionBtn: PropTypes.func,
  btnVariant: PropTypes.string,
  btnClassName: PropTypes.string,
};
export default Footer;
