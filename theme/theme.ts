// theme/theme.ts
"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#407BFF" },
    background: {
      default: "#F5F7FF",
      paper: "#FFFFFF",
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: ["Inter", "system-ui", "sans-serif"].join(","),
  },
});
