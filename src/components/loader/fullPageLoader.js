import { Box, Backdrop, CircularProgress } from "@mui/material";
const FullPageLoader = ({ open }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: 1,
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" size="60px"/>
      </Backdrop>
    </Box>
  );
};

export default FullPageLoader;
