import { Box, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Dashboard() {
  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F5F7FF">
      <Sidebar />

      <Box flex={1} display="flex" flexDirection="column">
        <Topbar />

        <Box p={4}>
          <Typography variant="h5" fontWeight="600">
            Welcome to StuffBi Dashboard
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
