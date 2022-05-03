import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#443FB5",
    },
    secondary: {
      main: "#f9b934",
    },
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  },
});

export default theme;
