import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#D5AC7A",
      contrastText: "#000000",
    },
    secondary: {
      main: "#F0F0F0",
      contrastText: "rgba(0, 0, 0, 0.4)",
    },
  },
  parts: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 15,
          width: "100%",
          height: 50,
          border: "1px solid #000",
          color: "rgba(0, 0, 0)",
        },
      },
    },
  },
});

export default theme;
