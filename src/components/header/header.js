import { Stack, Button } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { setExitSessionModal } from "state/reducers/modalInfo";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";

const Header = ({
  leftText,
  midText,
  hideActionBtn,
  disableActionBtn,
  showBackButton = false,
  onBack = () => {},
}) => {
  const Dispatch = useDispatch();
  const onActionBtnClick = () => {
    Dispatch(setExitSessionModal(true));
  };
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={12}
      className="PodInstructionHead"
    >
      <div className="lftTxt">
        {showBackButton && (
          <IconButton onClick={onBack} size="small" color="secondary" sx={{mr:1}}>
            <ArrowBackIcon />
          </IconButton>
        )}
        {leftText}
      </div>
      {
        <>
          <div className="middleTxt">
            <h1>{midText}</h1>
          </div>
          {!hideActionBtn && (
            <Button
              variant="contained"
              className="exit_btn"
              onClick={onActionBtnClick}
              disabled={disableActionBtn}
            >
              Exit Session
            </Button>
          )}
        </>
      }
    </Stack>
  );
};
Header.propTypes = {
  leftText: PropTypes.element.isRequired,
  midText: PropTypes.string,
  hideActionBtn: PropTypes.bool,
  disableActionBtn: PropTypes.bool,
  onActionBtnClick: PropTypes.func,
};
export default Header;
