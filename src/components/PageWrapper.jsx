import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function PageWrapper({ children }) {
  return (
    <Box display="flex" bgcolor="#F5F7FF" minHeight="100vh">
      <Sidebar />

      <Box flex={1} display="flex" flexDirection="column">
        <Topbar />

        <Box
          component="main"
          sx={{
            px: 4,
            py: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
