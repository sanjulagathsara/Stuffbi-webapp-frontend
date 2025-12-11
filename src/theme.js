import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  palette: {
    background: {
      default: "#F5F7FF",
    },
    primary: {
      main: "#3B82F6",
    },
    secondary: {
      main: "#64748B",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
